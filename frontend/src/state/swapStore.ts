import { Address, fromNano } from '@ton/core';
import JSBI from 'jsbi';
import { useCallback, useMemo } from 'react';
import { jettons } from 'src/constants/jettons';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { useJetton } from 'src/hooks/jetton/useJetton';
import { useJettonBalance } from 'src/hooks/jetton/useJettonBalance';
import { useJettonWalletAddress } from 'src/hooks/jetton/useJettonWalletAddress';
import { useBestTradeExactIn } from 'src/hooks/swap/useBestTrade';
import useSwapSlippageTolerance from 'src/hooks/swap/useSwapSlippageTolerance';
import {
  maxAmountSpend,
  TradeType,
  Jetton,
  JettonAmount,
  Percent,
  Trade,
  computePoolAddress,
  TickMath,
  ROUTER,
  PoolMessageManager,
} from '@toncodex/sdk';
import { SwapField, SwapFieldType } from 'src/types/swap-field';
import { TradeState, TradeStateType } from 'src/types/trade-state';
import { parseUnits } from 'src/utils/common/parseUnits';
import { create } from 'zustand';
import { useDebounce } from 'src/hooks/common/useDebounce';
import {
  TransactionFeeState,
  TransactionFeeStatus,
} from 'src/types/transaction-fee-state';

export interface IDerivedSwapInfo {
  currencies: { [field in SwapFieldType]?: Jetton };
  currencyBalances: { [field in SwapFieldType]?: JettonAmount<Jetton> };
  parsedAmount: JettonAmount<Jetton> | undefined;
  inputError?: string;
  tradeState: {
    trade: Trade<Jetton, Jetton, TradeType> | null;
    state: TradeStateType;
    fee?: bigint[] | null;
  };
  toggledTrade: Trade<Jetton, Jetton, TradeType> | undefined;
  tickAfterSwap: number | null | undefined;
  allowedSlippage: Percent;
  // poolFee: number | undefined;
  // tick: number | undefined;
  // tickSpacing: number | undefined;
  poolAddress: string | undefined;
  isExactIn: boolean;
}

interface SwapState {
  readonly independentField: SwapFieldType;
  readonly typedValue: string;
  readonly [SwapField.INPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly [SwapField.OUTPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly wasInverted: boolean;
  readonly lastFocusedField: SwapFieldType;
  // formatted ton tx fee
  readonly transactionFee: TransactionFeeState;
  actions: {
    selectCurrency: (
      field: SwapFieldType,
      currencyId: string | undefined,
    ) => void;
    switchCurrencies: (dependentValue?: string) => void;
    typeInput: (field: SwapFieldType, typedValue: string) => void;
    setTransactionFee: (transactionFee: TransactionFeeState) => void;
  };
}

export const useSwapState = create<SwapState>((set, get) => ({
  independentField: SwapField.INPUT,
  typedValue: '',
  [SwapField.INPUT]: {
    currencyId: jettons.TON.address,
  },
  [SwapField.OUTPUT]: {
    currencyId: jettons.USD.address,
  },
  wasInverted: false,
  lastFocusedField: SwapField.INPUT,
  transactionFee: {
    status: TransactionFeeStatus.NONE,
    fee: fromNano(PoolMessageManager.gasUsage.SWAP_GAS_BASE),
    gasForward: fromNano(PoolMessageManager.gasUsage.TRANSFER_GAS * 4n), // 4 maximum messages in tx
    gasLimit: fromNano(
      PoolMessageManager.gasUsage.SWAP_GAS_BASE +
        PoolMessageManager.gasUsage.TRANSFER_GAS * 4n,
    ),
  },
  actions: {
    selectCurrency: (field, currencyId) => {
      const otherField =
        field === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT;

      if (currencyId && currencyId === get()[otherField].currencyId) {
        set({
          independentField:
            get().independentField === SwapField.INPUT
              ? SwapField.OUTPUT
              : SwapField.INPUT,
          lastFocusedField:
            get().independentField === SwapField.INPUT
              ? SwapField.OUTPUT
              : SwapField.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: get()[field].currencyId },
        });
      } else {
        set({
          [field]: { currencyId },
        });
      }
    },
    switchCurrencies: (dependentValue) => {
      set({
        // independentField: get().independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT,
        // lastFocusedField: get().independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT,
        [SwapField.INPUT]: { currencyId: get()[SwapField.OUTPUT].currencyId },
        [SwapField.OUTPUT]: { currencyId: get()[SwapField.INPUT].currencyId },
      });
      set({ typedValue: dependentValue });
    },
    typeInput: (field, typedValue) =>
      set({
        independentField: field,
        lastFocusedField: field,
        typedValue,
      }),
    setTransactionFee: (transactionFee) => set({ transactionFee }),
  },
}));

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: SwapFieldType, currency: Jetton) => void;
  onSwitchTokens: (dependentValue?: string) => void;
  onUserInput: (field: SwapFieldType, typedValue: string) => void;
} {
  const {
    actions: { selectCurrency, switchCurrencies, typeInput },
  } = useSwapState();

  const onCurrencySelection = useCallback(
    (field: SwapFieldType, currency: Jetton) =>
      selectCurrency(field, currency.address),
    [],
  );

  const onSwitchTokens = useCallback((dependentValue?: string) => {
    switchCurrencies(dependentValue);
  }, []);

  const onUserInput = useCallback(
    (field: SwapFieldType, typedValue: string) => {
      typeInput(field, typedValue);
    },
    [],
  );

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
  };
}

export function tryParseAmount<T extends Jetton>(
  value?: string,
  currency?: T,
): JettonAmount<T> | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return JettonAmount.fromRawAmount(currency, typedValueParsed);
    }
  } catch (error) {
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  return undefined;
}

export function useDerivedSwapInfo(): IDerivedSwapInfo {
  const { wallet: account } = useTonConnect();

  const {
    independentField,
    typedValue,
    [SwapField.INPUT]: { currencyId: inputCurrencyId },
    [SwapField.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState();

  const debouncedValue = useDebounce(typedValue, 300);

  const inputCurrency = useJetton(inputCurrencyId);
  const outputCurrency = useJetton(outputCurrencyId);

  const routerJetton0Wallet = useJettonWalletAddress({
    jettonMinterAddress: inputCurrencyId,
    ownerAddress: ROUTER,
  });
  const routerJetton1Wallet = useJettonWalletAddress({
    jettonMinterAddress: outputCurrencyId,
    ownerAddress: ROUTER,
  });

  const isExactIn: boolean = independentField === SwapField.INPUT;
  const parsedAmount = useMemo(
    () =>
      tryParseAmount(
        debouncedValue as string,
        (isExactIn ? inputCurrency : outputCurrency) ?? undefined,
      ),
    [debouncedValue, isExactIn, inputCurrency, outputCurrency],
  );

  const poolAddress = useMemo(() => {
    if (!routerJetton0Wallet || !routerJetton1Wallet) return undefined;

    return computePoolAddress(
      Address.parse(routerJetton0Wallet),
      Address.parse(routerJetton1Wallet),
    ).toString();
  }, [routerJetton0Wallet, routerJetton1Wallet]);

  const bestTradeExactIn = useBestTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined,
    poolAddress,
  );
  // const bestTradeExactOut = useBestTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined, poolAddress);

  const trade = bestTradeExactIn ?? undefined;

  const [addressA, addressB] = [
    inputCurrency?.address || '',
    outputCurrency?.address || '',
  ];

  const inputCurrencyBalance = useJettonBalance(addressA, account);
  const outputCurrencyBalance = useJettonBalance(addressB, account);

  const currencyBalances = {
    [SwapField.INPUT]:
      inputCurrency && inputCurrencyBalance
        ? JettonAmount.fromRawAmount(inputCurrency, inputCurrencyBalance)
        : undefined,
    [SwapField.OUTPUT]:
      outputCurrency && outputCurrencyBalance
        ? JettonAmount.fromRawAmount(outputCurrency, outputCurrencyBalance)
        : undefined,
  };

  const currencies: { [field in SwapFieldType]?: Jetton } = {
    [SwapField.INPUT]: inputCurrency ?? undefined,
    [SwapField.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = `Connect Wallet`;
  }

  if (!parsedAmount) {
    inputError = inputError ?? `Enter an amount`;
  }

  if (!currencies[SwapField.INPUT] || !currencies[SwapField.OUTPUT]) {
    inputError = inputError ?? `Select a token`;
  }

  if (
    trade.state === TradeState.INVALID ||
    trade.state === TradeState.NO_ROUTE_FOUND
  ) {
    inputError = inputError ?? `Insufficient liquidity`;
  }

  const toggledTrade = trade.trade ?? undefined;

  const tickAfterSwap =
    trade.priceAfterSwap &&
    TickMath.getTickAtSqrtRatio(
      JSBI.BigInt(
        trade.priceAfterSwap[trade.priceAfterSwap.length - 1].toString(),
      ),
    );

  const allowedSlippage = useSwapSlippageTolerance(toggledTrade);

  const [balanceIn, amountIn] = [
    currencyBalances[SwapField.INPUT],
    toggledTrade?.maximumAmountIn(allowedSlippage),
  ];

  const maxAmountIn = maxAmountSpend(balanceIn);

  if (
    balanceIn &&
    amountIn &&
    maxAmountIn &&
    (balanceIn.lessThan(amountIn) || parsedAmount?.greaterThan(maxAmountIn))
  ) {
    inputError = `Insufficient ${amountIn.jetton.symbol} balance`;
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    isExactIn,
    tradeState: trade,
    toggledTrade,
    tickAfterSwap,
    allowedSlippage,
    // poolFee: globalState && globalState[2],
    // tick: globalState && globalState[1],
    // tickSpacing: tickSpacing,
    poolAddress,
  };
}

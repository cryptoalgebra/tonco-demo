import { useCallback } from 'react';
import {
  IDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from 'src/state/swapStore';
import { SwapField, SwapFieldType } from 'src/types/swap-field';
import { MenuState } from 'src/types/token-menu';
import { SwitchButton } from 'src/components/ui/Button';
import { Jetton, JettonAmount, maxAmountSpend } from '@toncodex/sdk';
import { useUSDValue } from 'src/hooks/jetton/useUSDValue';
import { useDebounce } from 'src/hooks/common/useDebounce';
import TokenCard from '../TokenCard';

function SwapPair({
  swapInfo,
  lockCurrencies,
}: {
  swapInfo: IDerivedSwapInfo;
  lockCurrencies?: boolean;
}) {
  const {
    parsedAmount,
    toggledTrade: trade,
    currencies,
    currencyBalances,
  } = swapInfo;

  const baseCurrency = currencies[SwapField.INPUT];
  const quoteCurrency = currencies[SwapField.OUTPUT];

  const { independentField, typedValue } = useSwapState();
  const dependentField: SwapFieldType =
    independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT;

  const { onUserInput, onSwitchTokens } = useSwapActionHandlers();

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(SwapField.INPUT, value);
    },
    [onUserInput],
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(SwapField.OUTPUT, value);
    },
    [onUserInput],
  );

  const parsedAmountA =
    independentField === SwapField.INPUT ? parsedAmount : trade?.inputAmount;

  const parsedAmountB =
    independentField === SwapField.OUTPUT ? parsedAmount : trade?.outputAmount;

  const parsedAmounts = {
    [SwapField.INPUT]: parsedAmountA,
    [SwapField.OUTPUT]: parsedAmountB,
  };

  const maxInputAmount: JettonAmount<Jetton> | undefined = maxAmountSpend(
    currencyBalances[SwapField.INPUT],
  );

  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) {
      onUserInput(SwapField.INPUT, maxInputAmount.toExact());
    }
  }, [maxInputAmount, onUserInput]);

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toFixed(),
  };

  const usdValueA = useUSDValue(
    Number(useDebounce(formattedAmounts[SwapField.INPUT] || '', 300)),
    baseCurrency,
  );
  const usdValueB = useUSDValue(
    Number(formattedAmounts[SwapField.OUTPUT]),
    quoteCurrency,
  );

  const percentDifference = ((usdValueB - usdValueA) / usdValueA) * 100;

  return (
    <div className="relative flex flex-col gap-4">
      <TokenCard
        value={formattedAmounts[SwapField.INPUT] || ''}
        currency={baseCurrency}
        handleValueChange={handleTypeInput}
        handleMaxValue={handleMaxInput}
        menuType={MenuState.INPUT}
        usdValue={usdValueA}
        lockCurrencies={lockCurrencies}
      />
      <SwitchButton
        onClick={() => onSwitchTokens(formattedAmounts[SwapField.OUTPUT])}
        className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      />
      <TokenCard
        value={formattedAmounts[SwapField.OUTPUT] || ''}
        currency={quoteCurrency}
        handleValueChange={handleTypeOutput}
        menuType={MenuState.OUTPUT}
        usdValue={usdValueB}
        percentDifference={percentDifference}
        disabled
        lockCurrencies={lockCurrencies}
      />
    </div>
  );
}

export default SwapPair;

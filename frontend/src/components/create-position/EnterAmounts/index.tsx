import { useCallback, useEffect } from 'react';
import { Field, Jetton, Percent } from '@toncodex/sdk';
import {
  IDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from 'src/state/mintStore';
import TokenCard from 'src/components/swap/TokenCard';
import { MenuState } from 'src/types/token-menu';
import { useUSDValue } from 'src/hooks/jetton/useUSDValue';
import { useDebounce } from 'src/hooks/common/useDebounce';
import { maxAmountMint } from 'src/utils/mint/maxAmountMint';

interface EnterAmountsProps {
  currencyA: Jetton | undefined;
  currencyB: Jetton | undefined;
  mintInfo: IDerivedMintInfo;
  slippage: Percent;
}

function EnterAmounts({
  currencyA,
  currencyB,
  mintInfo,
  slippage,
}: EnterAmountsProps) {
  const { independentField, typedValue } = useMintState();

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(
    mintInfo.noLiquidity,
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [mintInfo.dependentField]:
      mintInfo.parsedAmounts[mintInfo.dependentField]?.toSignificant(6) ?? '',
  };

  const usdValueA = useUSDValue(
    Number(useDebounce(formattedAmounts[Field.CURRENCY_A], 300)),
    currencyA,
  );
  const usdValueB = useUSDValue(
    Number(useDebounce(formattedAmounts[Field.CURRENCY_B], 300)),
    currencyB,
  );

  const handleMaxInput = useCallback(
    (field: Field) => {
      const balanceA = mintInfo.currencyBalances[Field.CURRENCY_A];
      const balanceB = mintInfo.currencyBalances[Field.CURRENCY_B];

      let maxAmount;

      switch (field) {
        case Field.CURRENCY_A:
          if (!balanceA) return;

          maxAmount = maxAmountMint(balanceA, slippage);
          onFieldAInput(maxAmount.toSignificant(10));
          break;
        case Field.CURRENCY_B:
          if (!balanceB) return;

          maxAmount = maxAmountMint(balanceB, slippage);
          onFieldBInput(maxAmount.toSignificant(10));
          break;
        default:
          break;
      }
    },
    [mintInfo.currencyBalances, slippage, onFieldAInput, onFieldBInput],
  );

  useEffect(
    () => () => {
      onFieldAInput('');
      onFieldBInput('');
    },
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex w-full">
        <TokenCard
          currency={currencyA}
          handleValueChange={onFieldAInput}
          value={formattedAmounts[Field.CURRENCY_A]}
          menuType={MenuState.CLOSED}
          handleMaxValue={() => handleMaxInput(Field.CURRENCY_A)}
          usdValue={usdValueA}
        />
        {mintInfo.depositADisabled && (
          <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-xl bg-dark/90 text-lg font-bold">
            <span>For selected range</span>
            <span>this deposit is disabled</span>
          </div>
        )}
      </div>
      <div className="relative flex w-full">
        <TokenCard
          currency={currencyB}
          handleValueChange={onFieldBInput}
          value={formattedAmounts[Field.CURRENCY_B]}
          menuType={MenuState.CLOSED}
          handleMaxValue={() => handleMaxInput(Field.CURRENCY_B)}
          usdValue={usdValueB}
        />
        {mintInfo.depositBDisabled && (
          <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-xl bg-dark/90 text-lg font-bold">
            <span>For selected range</span>
            <span>this deposit is disabled</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnterAmounts;

import { useMemo } from 'react';
import { Bound, Jetton, Price } from '@toncodex/sdk';
import { IDerivedMintInfo } from 'src/state/mintStore';
import RangeSelectorPart from '../RangeSelectorPart';

export interface RangeSelectorProps {
  priceLower: Price<Jetton, Jetton> | undefined;
  priceUpper: Price<Jetton, Jetton> | undefined;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  currencyA: Jetton | null | undefined;
  currencyB: Jetton | null | undefined;
  disabled: boolean;
  mintInfo: IDerivedMintInfo;
  isSorted: boolean;
}

function RangeSelector({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  // currencyA,
  currencyB,
  disabled,
  mintInfo,
  isSorted,
}: RangeSelectorProps) {
  const leftPrice = useMemo(
    () => (isSorted ? priceLower : priceUpper?.invert()),
    [isSorted, priceLower, priceUpper],
  );

  const rightPrice = useMemo(
    () => (isSorted ? priceUpper : priceLower?.invert()),
    [isSorted, priceUpper, priceLower],
  );

  return (
    <div className="flex w-full justify-center gap-4 max-sm:flex-col sm:gap-24">
      <RangeSelectorPart
        value={
          mintInfo.ticksAtLimit[Bound.LOWER]
            ? '0'
            : (leftPrice?.toSignificant(5) ?? '')
        }
        onUserInput={onLeftRangeInput}
        width="100%"
        decrement={isSorted ? getDecrementLower : getIncrementUpper}
        increment={isSorted ? getIncrementLower : getDecrementUpper}
        decrementDisabled={mintInfo.ticksAtLimit[Bound.LOWER]}
        incrementDisabled={mintInfo.ticksAtLimit[Bound.LOWER]}
        label={leftPrice ? `${currencyB?.symbol}` : '-'}
        initialPrice={mintInfo.price}
        disabled={disabled}
        isSorted={isSorted}
        title="Min price"
      />
      <RangeSelectorPart
        value={
          mintInfo.ticksAtLimit[Bound.UPPER]
            ? '∞'
            : (rightPrice?.toSignificant(5) ?? '')
        }
        onUserInput={onRightRangeInput}
        decrement={isSorted ? getDecrementUpper : getIncrementLower}
        increment={isSorted ? getIncrementUpper : getDecrementLower}
        incrementDisabled={mintInfo.ticksAtLimit[Bound.UPPER]}
        decrementDisabled={mintInfo.ticksAtLimit[Bound.UPPER]}
        label={rightPrice ? `${currencyB?.symbol}` : '-'}
        initialPrice={mintInfo.price}
        disabled={disabled}
        isSorted={isSorted}
        title="Max price"
      />
    </div>
  );
}

export default RangeSelector;

import { useMemo } from 'react';
import ReactSlider from 'react-slider';
import { Jetton, Price } from '@toncodex/sdk';
import { IDerivedMintInfo } from 'src/state/mintStore';

export interface PriceSliderProps {
  priceLower: Price<Jetton, Jetton> | undefined;
  priceUpper: Price<Jetton, Jetton> | undefined;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  mintInfo: IDerivedMintInfo;
  currentPrice: string | undefined;
}

function PriceSlider({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  mintInfo,
  currentPrice,
}: PriceSliderProps) {
  const isSorted = true;

  const leftPrice = useMemo(
    () => (isSorted ? priceLower : priceUpper?.invert()),
    [isSorted, priceLower, priceUpper],
  );

  const rightPrice = useMemo(
    () => (isSorted ? priceUpper : priceLower?.invert()),
    [isSorted, priceUpper, priceLower],
  );

  const values = [Number(leftPrice?.toFixed()), Number(rightPrice?.toFixed())];

  const priceNum = Number(mintInfo.price?.toFixed(4));

  const setValues = (values: number[]) => {
    onLeftRangeInput(values[0].toString());
    onRightRangeInput(values[1].toString());
  };

  return (
    <div className="relative mb-10 mt-6 h-fit w-full">
      <ReactSlider
        className="relative h-4 w-full"
        thumbClassName="flex items-center relative justify-center w-8 h-8 bg-primary-green text-white rounded-full cursor-grab border-4 border-white"
        trackClassName="absolute top-1/2 h-4 bg-border-light rounded-xl"
        value={values}
        onChange={(val) => setValues(val)}
        min={priceNum * 0.01}
        max={priceNum * 2}
        step={0.01}
        pearling
        minDistance={0.01}
        renderTrack={(props, state) => {
          const trackClassName =
            state.index === 1
              ? 'absolute top-1/2 h-4 bg-primary-green rounded-xl'
              : 'absolute top-1/2 h-4 bg-border-light rounded-xl';
          return <div {...props} className={trackClassName} />;
        }}
        renderThumb={(props, state) => (
          <div {...props}>
            <div className="absolute top-8">{state.valueNow}</div>
          </div>
        )}
      />
      <div className="absolute left-1/2 top-1 -translate-x-1/2 transform text-white">
        |
      </div>
      <div className="absolute -top-10 left-1/2 w-fit -translate-x-1/2 transform rounded-xl bg-border-light p-2 text-xs text-primary-green">
        Current price: {currentPrice}
      </div>
    </div>
  );
}

export default PriceSlider;

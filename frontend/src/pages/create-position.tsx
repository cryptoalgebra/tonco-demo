import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LiquidityChartRangeInput from 'src/components/common/LiquidityChartRangeInput';
import { PriceToggle } from 'src/components/common/PriceToggle';
import AmountsSection from 'src/components/create-position/AmountsSection';
import PresetTabs from 'src/components/create-position/PresetTabs';
import RangeSelector from 'src/components/create-position/RangeSelector';
import SwapSettings from 'src/components/swap/SwapSettings';
import { Button } from 'src/components/ui/Button';
import { usePoolV3 } from 'src/hooks/pool/usePoolV3';
import { Bound, INITIAL_POOL_FEE } from '@toncodex/sdk';
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
  useRangeHopCallbacks,
} from 'src/state/mintStore';
import { formatAmount } from 'src/utils/common/formatAmount';

function CreatePositionPage() {
  const [isSorted, setIsSorted] = useState(true);
  const { poolId } = useParams();

  const [, pool] = usePoolV3(poolId);

  const mintInfo = useDerivedMintInfo(
    isSorted ? pool?.jetton0 : pool?.jetton1,
    isSorted ? pool?.jetton1 : pool?.jetton0,
    poolId,
    INITIAL_POOL_FEE,
    isSorted ? pool?.jetton0 : pool?.jetton1,
  );

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } =
    mintInfo.pricesAtTicks;

  const price = useMemo(() => {
    if (!mintInfo.price) return undefined;

    return mintInfo.invertPrice
      ? mintInfo.price.invert().toSignificant(5)
      : mintInfo.price.toSignificant(5);
  }, [mintInfo]);

  const currentPrice = useMemo(() => {
    const token0 = isSorted ? pool?.jetton0 : pool?.jetton1;
    const token1 = isSorted ? pool?.jetton1 : pool?.jetton0;
    if (!price) return undefined;

    if (Number(price) <= 0.0001) {
      return `< 0.0001 ${token1?.symbol} per ${token0?.symbol}`;
    }
    return `${formatAmount(price)} ${token1?.symbol} per ${token0?.symbol}`;
  }, [isSorted, pool?.jetton0, pool?.jetton1, price]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = useMemo(
    () => mintInfo.ticks,
    [mintInfo],
  );

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
  } = useRangeHopCallbacks(
    pool?.jetton0,
    pool?.jetton1,
    mintInfo.tickSpacing,
    tickLower,
    tickUpper,
    mintInfo.pool,
  );

  const { onLeftRangeInput, onRightRangeInput } = useMintActionHandlers(true);

  const { startPriceTypedValue } = useMintState();

  useEffect(
    () => () => {
      onLeftRangeInput('');
      onRightRangeInput('');
    },
    [],
  );

  /* auto invert price if toggle sorting */
  useEffect(() => {
    if (!priceUpper || !priceLower || mintInfo.ticksAtLimit.UPPER || !pool)
      return;

    if (isSorted) {
      onLeftRangeInput(priceUpper.toFixed(12));
      onRightRangeInput(priceLower.toFixed(12));
    } else {
      onLeftRangeInput(priceLower.toFixed(12));
      onRightRangeInput(priceUpper.toFixed(12));
    }
    // }
  }, [isSorted]);

  return (
    <div className="grid w-full animate-fade-in grid-cols-1 gap-8 py-6 max-md:pb-24 sm:py-12 lg:flex">
      <div className="flex w-full flex-col">
        <div className="mb-6 flex h-10 items-center justify-between">
          <h2 className="text-2xl">1. Select Range</h2>
          <Link className="sm:hidden" to={`/pool/${poolId}`}>
            <Button className="flex h-6 gap-2 rounded-xl" variant={'outline'}>
              <ArrowLeft size={12} />
              Back
            </Button>
          </Link>
        </div>
        <div className="flex w-full flex-col gap-2 rounded-xl border border-border-light bg-light p-3 text-left sm:gap-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-md sm:text-xl">Choose liquidity preset</h3>
            <PriceToggle
              isSorted={isSorted}
              setIsSorted={setIsSorted}
              jetton0={pool?.jetton0}
              jetton1={pool?.jetton1}
            />
          </div>
          <PresetTabs
            currencyA={isSorted ? pool?.jetton0 : pool?.jetton1}
            currencyB={isSorted ? pool?.jetton1 : pool?.jetton0}
            mintInfo={mintInfo}
          />
          <div className="my-4 flex items-center justify-between">
            <h3 className="text-md h-fit sm:text-xl">Price</h3>
            <div className="h-fit w-fit rounded-xl bg-border-light p-2 text-xs text-primary-green">
              Current price: {currentPrice}
            </div>
          </div>
          <LiquidityChartRangeInput
            // currencyA={isSorted ? pool?.jetton0 : pool?.jetton1}
            // currencyB={isSorted ? pool?.jetton1 : pool?.jetton0}
            pool={pool}
            priceLower={priceLower}
            priceUpper={priceUpper}
            ticksAtLimit={mintInfo.ticksAtLimit}
            price={price ? parseFloat(price) : undefined}
            onLeftRangeInput={onLeftRangeInput}
            onRightRangeInput={onRightRangeInput}
            variant={'dark'}
            width={window.innerWidth > 768 ? 600 : 320}
            isSorted={isSorted}
          />
          <div className="flex w-full flex-col gap-2 sm:gap-4">
            <RangeSelector
              priceLower={priceLower}
              priceUpper={priceUpper}
              getDecrementLower={getDecrementLower}
              getIncrementLower={getIncrementLower}
              getDecrementUpper={getDecrementUpper}
              getIncrementUpper={getIncrementUpper}
              onLeftRangeInput={onLeftRangeInput}
              onRightRangeInput={onRightRangeInput}
              currencyA={isSorted ? pool?.jetton0 : pool?.jetton1}
              currencyB={isSorted ? pool?.jetton1 : pool?.jetton0}
              mintInfo={mintInfo}
              disabled={!startPriceTypedValue && !mintInfo.price}
              isSorted={isSorted}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6 flex h-10 items-center justify-between">
          <h2 className="text-2xl">2. Enter Amounts</h2>
          <SwapSettings />
        </div>
        <AmountsSection
          currencyA={isSorted ? pool?.jetton0 : pool?.jetton1}
          currencyB={isSorted ? pool?.jetton1 : pool?.jetton0}
          mintInfo={mintInfo}
        />
      </div>
    </div>
  );
}

export default CreatePositionPage;

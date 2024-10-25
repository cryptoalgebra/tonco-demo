import { formatUnits } from 'src/utils/common/formatUnits';
import { formatAmount } from 'src/utils/common/formatAmount';
import { JettonLogo } from 'src/components/common/JettonLogo';
import { useUSDValue } from 'src/hooks/jetton/useUSDValue';
import { PoolData } from 'src/hooks/pool/usePoolV3';
import { getTickToPrice } from '@toncodex/sdk';

export function PoolDetails({ poolData }: { poolData: PoolData | undefined }) {
  const jetton0 = poolData?.jetton0;
  const jetton1 = poolData?.jetton1;

  const jetton0Price =
    jetton0 && jetton1 && getTickToPrice(jetton0, jetton1, poolData.tick);
  const jetton1Price =
    jetton0 &&
    jetton1 &&
    getTickToPrice(jetton1, jetton0, poolData.tick, false);

  const formattedReserve0 =
    jetton0 && formatUnits(poolData.reserve0 || 0n, jetton0.decimals);
  const formattedReserve1 =
    jetton1 && formatUnits(poolData.reserve1 || 0n, jetton1.decimals);

  const usdReserve0 = useUSDValue(Number(formattedReserve0), jetton0);
  const usdReserve1 = useUSDValue(Number(formattedReserve1), jetton1);

  return (
    <div className="relative flex h-fit w-full flex-col gap-4 overflow-clip rounded-xl bg-light p-6 text-lg max-md:hidden">
      <h3 className="mr-auto">Pool Details</h3>

      <hr className="border-lighter" />
      <div className="flex flex-col gap-2 rounded-lg bg-lighter p-4">
        <div className="mr-auto text-sm text-white/50">Rates</div>
        <div className="mr-auto">
          1 {jetton0?.symbol} ≈{' '}
          {formatAmount(jetton0Price?.toSignificant() || 0, 6)}{' '}
          {jetton1?.symbol}
        </div>
        <div className="mr-auto">
          1 {jetton1?.symbol} ≈{' '}
          {formatAmount(jetton1Price?.toSignificant() || 0, 6)}{' '}
          {jetton0?.symbol}
        </div>
      </div>
      <hr className="border-lighter" />
      <div className="flex flex-col gap-2 rounded-lg bg-lighter p-4">
        <div className="mr-auto text-sm text-white/50">Reserves</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <JettonLogo size={24} jetton={jetton0} /> {jetton0?.symbol}
          </div>
          <div className="flex items-center gap-1">
            {formatAmount(formattedReserve0 || 0, 4)}
            {usdReserve0 ? (
              <span className="text-sm opacity-50">
                (${formatAmount(usdReserve0, 2)})
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <JettonLogo size={24} jetton={jetton1} /> {jetton1?.symbol}
          </div>
          <div className="flex items-center gap-1">
            {formatAmount(formattedReserve1 || 0, 4)}
            {usdReserve1 ? (
              <span className="text-sm opacity-50">
                (${formatAmount(usdReserve1, 2)})
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <hr className="border-lighter" />
      <div className="flex flex-col gap-2 rounded-lg bg-lighter p-4">
        <div className="mr-auto text-sm text-white/50">Total Positions</div>
        <div className="mr-auto">
          {poolData?.nftv3item_counter.toString()} NFTs
        </div>
      </div>
      {/* <div className="absolute bottom-4 left-0 w-full">
                <LiquidityChartRangeInput
                    // currencyA={pool.jetton0}
                    // currencyB={pool.jetton1}
                    pool={pool}
                    ticksAtLimit={{ [Bound.LOWER]: false, [Bound.UPPER]: false }}
                    price={price ? parseFloat(price) : undefined}
                    onLeftRangeInput={() => null}
                    onRightRangeInput={() => null}
                    isOnlyView={true}
                    variant={"dark"}
                />
            </div> */}
    </div>
  );
}

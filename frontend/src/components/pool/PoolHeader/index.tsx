import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JettonLogo } from 'src/components/common/JettonLogo';
import { useJettonPriceUSD } from 'src/hooks/jetton/useJettonPriceUSD';
import { PoolData } from 'src/hooks/pool/usePoolV3';
import { formatAmount } from 'src/utils/common/formatAmount';
import { formatPercent } from 'src/utils/common/formatPercent';
import { formatUnits } from 'src/utils/common/formatUnits';

export function PoolHeader({ poolData }: { poolData: PoolData | undefined }) {
  const jetton0 = poolData?.jetton0;
  const jetton1 = poolData?.jetton1;
  const jetton0PriceUSD = useJettonPriceUSD(jetton0);
  const jetton1PriceUSD = useJettonPriceUSD(jetton1);

  const tvlUSD =
    poolData &&
    jetton0 &&
    jetton1 &&
    Number(formatUnits(poolData.reserve0, jetton0?.decimals)) *
      jetton0PriceUSD +
      Number(formatUnits(poolData.reserve1, jetton1?.decimals)) *
        Number(jetton1PriceUSD);

  const volume24USD = tvlUSD && tvlUSD / 12;

  const fees24USD =
    poolData &&
    jetton0 &&
    jetton1 &&
    (Number(formatUnits(poolData.collectedProtocolFee0, jetton0?.decimals)) *
      jetton0PriceUSD +
      Number(formatUnits(poolData.collectedProtocolFee1, jetton1?.decimals)) *
        jetton1PriceUSD) *
      333;

  const apr =
    tvlUSD && volume24USD && fees24USD && tvlUSD > 0
      ? (volume24USD * fees24USD) / tvlUSD
      : 0;

  return (
    <section className="flex w-full items-center justify-between gap-4 rounded-xl border-0 border-border-light bg-light p-4 max-sm:flex-col max-sm:items-start">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl sm:h-24 sm:w-24">
          <JettonLogo jetton={jetton0} size={42} />
          <JettonLogo className="-ml-2" jetton={jetton1} size={42} />
        </div>
        <div className="mr-auto flex flex-col items-start gap-1 text-nowrap">
          <h2 className="sm:text-2xl">
            {jetton0?.symbol} / {jetton1?.symbol}
          </h2>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="h-fit rounded-xl bg-primary-red/30 p-1 px-2 text-sm text-pink-300">{`${
              (poolData?.lp_fee_current || 1) / 100
            }%`}</div>
            <Link to={`/explore/pools/${poolData?.poolAddress}`}>
              <button
                type={'button'}
                className="text-md flex w-fit items-center gap-1 rounded-xl border-0 px-2 py-1 text-purple-300 transition-all duration-300 hover:bg-lighter max-sm:text-sm sm:items-end"
              >
                Analytics <ArrowRight className="-rotate-45 max-sm:size-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
      <hr className="w-full border-lighter sm:hidden" />
      <div className="grid w-fit grid-cols-3 items-center gap-4 sm:grid-cols-4 sm:gap-16 sm:p-4">
        <div className="flex flex-col items-start sm:items-end">
          <h3 className="text-xs opacity-50 sm:text-[16px]">TVL</h3>
          <p className="text-xl">${formatAmount(tvlUSD || 0, 4)}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <h3 className="text-xs opacity-50 sm:text-[16px]">Volume (24h)</h3>
          <p className="text-xl">${formatAmount(volume24USD || 0, 4)}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <h3 className="text-xs opacity-50 sm:text-[16px]">Fees (24h)</h3>
          <p className="text-xl">${formatAmount(fees24USD || 0, 4)}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <h3 className="text-xs opacity-50 sm:text-[16px]">APR (24h)</h3>
          <p className="text-xl text-green-500">+{formatPercent.format(apr)}</p>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { JettonLogo } from 'src/components/common/JettonLogo';
import Chart from 'src/components/explore/Chart';
import {
  CHART_SPAN,
  CHART_TYPE,
  CHART_VIEW,
  ChartSpanType,
  ChartTypeType,
} from 'src/components/explore/types';
import { GroupBy, useGetPoolDataQuery } from 'src/graphql/generated/graphql';
import { useJetton } from 'src/hooks/jetton/useJetton';
import { isDefined } from 'src/utils/common/isDefined';
import SwapPair from 'src/components/swap/SwapPair';
import { SwapButton } from 'src/components/swap/SwapButton';
import { useDerivedSwapInfo, useSwapActionHandlers } from 'src/state/swapStore';
import { UNIX_TIMESTAMPS } from 'src/constants/charts';
import { Copy, Gem } from 'lucide-react';
import { usePoolData } from 'src/hooks/pool/usePoolV3';
import TransactionsList from 'src/components/transactions/TransactionsList';
import { SwapField } from 'src/types/swap-field';
import { UTCTimestamp } from 'lightweight-charts';

const values = {
  [CHART_TYPE.TVL]: 'totalValueLockedUsd',
  [CHART_TYPE.VOLUME]: 'volumeUsd',
  [CHART_TYPE.FEES]: 'feesUsd',
  [CHART_TYPE.PRICE]: 'jetton0Price',
} as const;

function ExplorePoolPage() {
  const { poolId } = useParams();
  const { pathname } = useLocation();

  const [type, setType] = useState<ChartTypeType>(CHART_TYPE.TVL);
  const [span, setSpan] = useState<ChartSpanType>(CHART_SPAN.MONTH);

  const { data: poolData } = usePoolData(poolId);

  const jetton0 = useJetton(poolData?.jetton0.address);
  const jetton1 = useJetton(poolData?.jetton1.address);

  const swapInfo = useDerivedSwapInfo();

  const { onCurrencySelection } = useSwapActionHandlers();

  useEffect(() => {
    if (!jetton0 || !jetton1) return;
    onCurrencySelection(SwapField.INPUT, jetton0);
    onCurrencySelection(SwapField.OUTPUT, jetton1);
  }, [jetton0, jetton1, onCurrencySelection]);

  const now = useMemo(() => Date.now(), []);

  const { data } = useGetPoolDataQuery({
    variables: {
      poolDataId: poolId || '',
      from: now - UNIX_TIMESTAMPS[span],
      to: now,
      groupBy: GroupBy.Day,
    },
  });

  const chartData = useMemo(() => {
    if (!data?.poolData) return [];

    const value = values[type];

    return data.poolData.filter(isDefined).map((v) => ({
      time: Math.floor(v.unix / 1000) as UTCTimestamp,
      value: v[value],
    }));
  }, [data, type]);

  const currentValue = chartData.length
    ? chartData[chartData.length - 1].value
    : 0;

  const chartView = useMemo(() => {
    switch (type) {
      case CHART_TYPE.TVL:
        return CHART_VIEW.AREA;
      case CHART_TYPE.VOLUME:
        return CHART_VIEW.BAR;
      case CHART_TYPE.FEES:
        return CHART_VIEW.BAR;
      case CHART_TYPE.PRICE:
        return CHART_VIEW.LINE;
      default:
        return CHART_VIEW.AREA;
    }
  }, [type]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex w-full animate-fade-in flex-col gap-8 py-6 max-md:pb-24 sm:py-12">
      <div className="text-left">
        <Link
          to={{ pathname: '/explore', hash: 'list' }}
          className="hover:underline"
        >
          Explore
        </Link>
        <span> / </span>
        <Link
          to={{ pathname: '/explore/pools', hash: 'list' }}
          className="hover:underline"
        >
          Pools
        </Link>
        <span> / </span>
        <span>
          {jetton0?.symbol} - {jetton1?.symbol}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="col-span-2 flex flex-col justify-between gap-8 md:flex-row md:items-center md:gap-0">
          <div className="flex items-center gap-8">
            <div className="flex gap-2">
              <JettonLogo jetton={jetton0} size={48} />
              <JettonLogo jetton={jetton1} size={48} />
            </div>
            {jetton0 && jetton1 ? (
              <h1 className="font-semibold">{`${jetton0?.symbol} - ${jetton1?.symbol}`}</h1>
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
          {poolData && (
            <div className="flex gap-4">
              <button
                type={'button'}
                onClick={() =>
                  navigator.clipboard.writeText(poolData.poolAddress.toString())
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-border-light bg-light px-3 py-1 hover:bg-lighter"
              >
                <Copy size={18} />
              </button>
              <Link
                to={`https://testnet.tonviewer.com/${poolData.poolAddress.toString()}`}
                target={'_blank'}
                className="inline-flex items-center gap-2 rounded-2xl border border-border-light bg-light px-3 py-1 hover:bg-lighter"
              >
                <Gem size={18} />
                Tonviewer
              </Link>
            </div>
          )}
        </div>
        <div className="hidden items-center md:flex">
          <h2 className="text-xl font-semibold">{`Trade ${jetton0?.symbol} / ${jetton1?.symbol}`}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <Chart
            chartData={chartData}
            chartSpan={span}
            chartTitle={type}
            chartView={chartView}
            chartType={type}
            setChartType={setType}
            setChartSpan={setSpan}
            chartCurrentValue={currentValue}
            showTypeSelector
            height={260}
          />
        </div>
        <div className={'flex flex-col gap-4'}>
          <SwapPair swapInfo={swapInfo} lockCurrencies />
          <SwapButton swapInfo={swapInfo} />
        </div>
      </div>

      <nav className="w-full border-b border-y-border-light pb-4 text-xl">
        <div className="select-none text-left font-semibold duration-200">
          Transactions
        </div>
      </nav>

      <div className="rounded-xl border border-border-light bg-light p-2 pb-5 sm:p-6 sm:pb-2">
        <TransactionsList poolId={poolId} />
      </div>
    </div>
  );
}

export default ExplorePoolPage;

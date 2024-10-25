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
import PoolsList from 'src/components/pools/PoolsList';
import { GroupBy, useGetJettonDataQuery } from 'src/graphql/generated/graphql';
import { useJetton } from 'src/hooks/jetton/useJetton';
import { isDefined } from 'src/utils/common/isDefined';
import SwapPair from 'src/components/swap/SwapPair';
import { SwapButton } from 'src/components/swap/SwapButton';
import { useDerivedSwapInfo, useSwapActionHandlers } from 'src/state/swapStore';
import { UNIX_TIMESTAMPS } from 'src/constants/charts';
import { Copy, Gem } from 'lucide-react';
import TransactionsList from 'src/components/transactions/TransactionsList';
import { SwapField } from 'src/types/swap-field';
import { jettons } from 'src/constants/jettons';
import { UTCTimestamp } from 'lightweight-charts';

const values = {
  [CHART_TYPE.TVL]: 'totalValueLockedUsd',
  [CHART_TYPE.VOLUME]: 'volumeUsd',
  [CHART_TYPE.FEES]: 'feesUsd',
  [CHART_TYPE.PRICE]: 'derivedTon',
} as const;

function ExploreJettonPage() {
  const { jettonId } = useParams();
  const { pathname } = useLocation();

  const [type, setType] = useState<ChartTypeType>(CHART_TYPE.TVL);
  const [span, setSpan] = useState<ChartSpanType>(CHART_SPAN.MONTH);

  const jetton = useJetton(jettonId);
  const swapInfo = useDerivedSwapInfo();

  const { onCurrencySelection } = useSwapActionHandlers();

  useEffect(() => {
    if (!jetton) return;
    onCurrencySelection(SwapField.INPUT, jetton);
    onCurrencySelection(
      SwapField.OUTPUT,
      jetton.address === jettons.TON.address ? jettons.USD : jettons.TON,
    );
  }, [jetton, onCurrencySelection]);

  const [tableView, setTableView] = useState<'pools' | 'transactions'>('pools');

  const now = useMemo(() => Date.now(), []);

  const { data } = useGetJettonDataQuery({
    variables: {
      jettonDataId: jettonId || '',
      from: now - UNIX_TIMESTAMPS[span],
      to: now,
      groupBy: GroupBy.Day,
    },
  });

  const chartData = useMemo(() => {
    if (!data?.jettonData) return [];

    const value = values[type];

    return data.jettonData.filter(isDefined).map((v) => ({
      time: Math.floor(v.time / 1000) as UTCTimestamp,
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

  const tables = {
    pools: <PoolsList jettonId={jettonId} isExplore />,
    transactions: <TransactionsList jettonId={jettonId} />,
  };

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
          to={{ pathname: '/explore/jettons', hash: 'list' }}
          className="hover:underline"
        >
          Jettons
        </Link>
        <span> / </span>
        <span>{jetton?.symbol}</span>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="flex flex-col justify-between gap-8 md:col-span-2 md:flex-row md:items-center">
          <div className="flex items-center gap-8">
            <JettonLogo jetton={jetton} size={48} />
            <h1 className="font-semibold">{jetton?.name}</h1>
            <span className="font-semibold text-gray-300">
              {jetton?.symbol}
            </span>
          </div>
          {jetton && (
            <div className="flex gap-4">
              <button
                type={'button'}
                onClick={() => navigator.clipboard.writeText(jetton.address)}
                className="inline-flex items-center gap-2 rounded-2xl border border-border-light bg-light px-3 py-1 hover:bg-lighter"
              >
                <Copy size={18} />
              </button>
              <Link
                to={`https://testnet.tonviewer.com/${jetton?.address}`}
                target={'_blank'}
                className="inline-flex items-center gap-2 rounded-2xl border border-border-light bg-light px-3 py-1 hover:bg-lighter"
              >
                <Gem size={18} />
                Tonviewer
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{`Trade ${jetton?.symbol}`}</h2>
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
        <ul className="flex gap-8 whitespace-nowrap">
          <button
            type={'button'}
            onClick={() => setTableView('pools')}
            className={`select-none font-semibold duration-200 ${
              tableView === 'pools'
                ? 'text-primary-green'
                : 'hover:text-primary-green'
            }`}
          >
            Pools
          </button>

          <button
            type={'button'}
            onClick={() => setTableView('transactions')}
            className={`select-none font-semibold duration-200 ${
              tableView === 'transactions'
                ? 'text-primary-green'
                : 'hover:text-primary-green'
            }`}
          >
            Transactions
          </button>
        </ul>
      </nav>

      <div className="rounded-xl border border-border-light bg-light p-2 pb-5 sm:p-6 sm:pb-2">
        {tables[tableView]}
      </div>
    </div>
  );
}

export default ExploreJettonPage;

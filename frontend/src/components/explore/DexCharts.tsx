import { GroupBy, useDexDataQuery } from 'src/graphql/generated/graphql';
import { useMemo, useState } from 'react';
import { UTCTimestamp } from 'lightweight-charts';
import { isDefined } from 'src/utils/common/isDefined';
import { UNIX_TIMESTAMPS } from 'src/constants/charts';
import { formatUSD } from 'src/utils/common/formatUSD';
import TotalStats from './TotalStats';
import {
  CHART_SPAN,
  CHART_TYPE,
  CHART_VIEW,
  ChartSpanType,
  ChartTypeType,
  ChartViewType,
} from './types';
import Chart from './Chart';

function ChartComponent({
  now,
  currentValue,
  title,
  selector,
  chartType,
  chartView,
  height,
  showTypeSelector = false,
}: {
  now: number;
  currentValue: number;
  title: string;
  selector:
    | 'totalValueLockedUsd'
    | 'totalVolumeUsd'
    | 'totalFeesUsd'
    | 'tonPriceUsd';
  chartType: ChartTypeType;
  chartView: ChartViewType;
  height: number;
  showTypeSelector?: boolean;
}) {
  const [span, setSpan] = useState<ChartSpanType>(CHART_SPAN.MONTH);
  const [type, setType] = useState<ChartTypeType>(chartType);

  const { data } = useDexDataQuery({
    variables: {
      from: now - UNIX_TIMESTAMPS[span],
      to: now,
      groupBy: GroupBy.Day,
    },
  });

  const chartData = useMemo(() => {
    if (!data?.dexData) return [];

    return data.dexData.filter(isDefined).map((v) => ({
      time: Math.floor(v.time / 1000) as UTCTimestamp,
      value: v[selector],
    }));
  }, [data, selector]);

  return (
    <Chart
      chartData={chartData}
      chartView={chartView}
      chartTitle={title}
      chartCurrentValue={currentValue || 0}
      chartSpan={span}
      setChartSpan={setSpan}
      chartType={type}
      setChartType={setType}
      showTypeSelector={showTypeSelector}
      height={height}
    />
  );
}

function DexCharts() {
  const now = useMemo(() => Date.now(), []);

  const { data } = useDexDataQuery({
    variables: {
      from: now - UNIX_TIMESTAMPS[CHART_SPAN.MONTH],
      to: now,
      groupBy: GroupBy.Day,
    },
  });

  const {
    currentTVL,
    currentVolume24H,
    currentFees24H,
    currentPoolCount,
    currentTonPrice,
    currentTxCount,
  } = useMemo(() => {
    if (!data?.dexData) return {};

    const now = data.dexData[data.dexData.length - 1];
    const dayAgo = data.dexData[data.dexData.length - 2];

    if (!now || !dayAgo) return {};

    const currentTVL = {
      value: now.totalValueLockedUsd,
      change: now.totalValueLockedUsd - dayAgo.totalValueLockedUsd,
    };

    const currentVolume24H = {
      value: now.totalVolumeUsd - dayAgo.totalVolumeUsd,
      change: now.totalVolumeUsd - dayAgo.totalVolumeUsd,
    };

    const currentFees24H = {
      value: now.totalFeesUsd - dayAgo.totalFeesUsd,
      change: now.totalFeesUsd - dayAgo.totalFeesUsd,
    };

    const currentTonPrice = now.tonPriceUsd;

    const currentTxCount = now.txCount;
    const currentPoolCount = now.poolCount;

    return {
      currentTVL,
      currentVolume24H,
      currentFees24H,
      currentTonPrice,
      currentTxCount,
      currentPoolCount,
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">Explore</h2>
        {currentTVL && (
          <div className="flex flex-col gap-4 md:flex-row">
            <span className="rounded-2xl border border-border-light bg-light px-2 py-1">{`${currentPoolCount} pools`}</span>
            <span className="rounded-2xl border border-border-light bg-light px-2 py-1">{`${currentTxCount} TXs`}</span>
            <span className="inline-flex gap-1 rounded-2xl border border-border-light bg-light p-1 pr-2">
              <span>
                <img
                  width={24}
                  height={24}
                  src={
                    'https://cache.tonapi.io/imgproxy/X7T-fLahBBVIxXacXAqrsCHIgFgTQE3Jt2HAdnc5_Mc/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS9sb2dvL3Rvbl9zeW1ib2wucG5n.webp'
                  }
                  alt={'TON logo'}
                />
              </span>
              <span>{`TON price: ${formatUSD.format(
                currentTonPrice || 0,
              )}`}</span>
            </span>
          </div>
        )}
      </div>
      <TotalStats
        currentTVL={currentTVL}
        currentVolume={currentVolume24H}
        currentFees={currentFees24H}
      />
      <div className="grid grid-rows-2 gap-8 lg:grid-cols-2 lg:grid-rows-1">
        <div className="rounded-xl border border-border-light bg-light p-4">
          <ChartComponent
            now={now}
            currentValue={currentTVL?.value || 0}
            selector={'totalValueLockedUsd'}
            title={'TVL'}
            chartView={CHART_VIEW.AREA}
            chartType={CHART_TYPE.TVL}
            height={180}
          />
        </div>
        <div className="rounded-xl border border-border-light bg-light p-4">
          <ChartComponent
            now={now}
            currentValue={currentVolume24H?.value || 0}
            selector={'totalVolumeUsd'}
            title={'Volume'}
            chartView={CHART_VIEW.BAR}
            chartType={CHART_TYPE.VOLUME}
            height={180}
          />
        </div>
        <div className="rounded-xl border border-border-light bg-light p-4">
          <ChartComponent
            now={now}
            currentValue={currentVolume24H?.value || 0}
            selector={'totalFeesUsd'}
            title={'Collected Fees'}
            chartView={CHART_VIEW.AREA}
            chartType={CHART_TYPE.VOLUME}
            height={180}
          />
        </div>
        <div className="rounded-xl border border-border-light bg-light p-4">
          <ChartComponent
            now={now}
            currentValue={Number(currentTonPrice || 0)}
            selector={'tonPriceUsd'}
            title={'TON Price'}
            chartView={CHART_VIEW.LINE}
            chartType={CHART_TYPE.PRICE}
            height={180}
          />
        </div>
      </div>
    </div>
  );
}

export default DexCharts;

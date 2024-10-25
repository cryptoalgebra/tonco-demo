import { UTCTimestamp } from 'lightweight-charts';

export const CHART_TYPE = {
  TVL: 'Total Value Locked',
  VOLUME: 'Volume',
  FEES: 'Fees',
  PRICE: 'Price',
} as const;

export const CHART_SPAN = {
  YEAR: '365',
  THREE_MONTH: '90',
  MONTH: '30',
  WEEK: '7',
  DAY: '1',
} as const;

export const CHART_VIEW = {
  AREA: 'area',
  BAR: 'bar',
  LINE: 'line',
} as const;

export const DEX_TYPE = {
  ALL: 'ALL',
  INTEGRAL: 'INTEGRAL',
  V3: 'V3',
} as const;

export type ChartTypeType = (typeof CHART_TYPE)[keyof typeof CHART_TYPE];
export type ChartSpanType = (typeof CHART_SPAN)[keyof typeof CHART_SPAN];
export type ChartViewType = (typeof CHART_VIEW)[keyof typeof CHART_VIEW];

export type ChartPiece = {
  time: number;
  tvl: string;
  volume: string;
  fees: string;
};

export type StatsData = { [key: string]: ChartPiece[] | null };

export type SummaryData = {
  totalVolumeUSD: number;
  totalValueLockedUSD: number;
  totalFeesUSD: number;
};

export interface IChart {
  chartData: { value: number; time: UTCTimestamp }[];
  chartView: ChartViewType;
  chartTitle: string;
  chartCurrentValue: number | undefined;
  chartSpan: ChartSpanType;
  setChartSpan: (chartSpan: ChartSpanType) => void;
  chartType: ChartTypeType;
  setChartType: (chartType: ChartTypeType) => void;
  showTypeSelector?: boolean;
  height: number;
}

export type StatsCard = {
  value: number;
  change: number;
};

export interface ITotalStats {
  currentTVL: StatsCard | undefined;
  currentVolume: StatsCard | undefined;
  currentFees: StatsCard | undefined;
}

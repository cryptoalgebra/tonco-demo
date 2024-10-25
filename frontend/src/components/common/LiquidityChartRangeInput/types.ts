import { Bound } from '@toncodex/sdk';

export type ChartVariant = 'default' | 'dark';

export interface ChartEntry {
  activeLiquidity: number;
  price0: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ZoomLevels {
  initialMin: number;
  initialMax: number;
  min: number;
  max: number;
}

export interface LiquidityChartRangeInputProps {
  // to distringuish between multiple charts in the DOM
  id?: string;

  data: {
    series: ChartEntry[];
    current: number;
  };
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };

  styles: {
    main: {
      primary: string;
      secondary: string;
    };
    area: {
      // color of the ticks in range
      selection: string;
    };
    brush: {
      handleStroke: string;
      handleAccent: string;
      handleBg: string;
    };
    tooltip: {
      bg: string;
      primary: string;
    };
  };

  dimensions: Dimensions;
  margins: Margins;

  interactive?: boolean;

  brushLabels: (d: 'w' | 'e', x: number) => string;
  brushDomain?: [number, number];
  onBrushDomainChange: (
    domain: [number, number],
    mode: string | undefined,
  ) => void;

  zoomLevels: ZoomLevels;

  isMock?: boolean;

  isOnlyView?: boolean;
}

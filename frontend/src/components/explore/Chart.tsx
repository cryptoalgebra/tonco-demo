import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import * as LightWeightCharts from 'lightweight-charts';
import { formatCurrency } from 'src/utils/common/formatCurrency';
import { formatUSD } from 'src/utils/common/formatUSD';
import { CHART_VIEW, type IChart } from './types';
import ChartSpanSelector from './ChartSpanSelector';
import ChartTypeSelector from './ChartTypeSelector';

export default function Chart({
  chartData,
  chartView,
  chartTitle,
  chartCurrentValue,
  chartSpan,
  setChartSpan,
  chartType,
  setChartType,
  showTypeSelector,
  height,
}: IChart) {
  const chartRef = useRef<HTMLDivElement>(null);

  const [series, setSeries] = useState<
    LightWeightCharts.ISeriesApi<'Line' | 'Area' | 'Histogram'> | undefined
  >();
  const [chartCreated, setChart] = useState<
    LightWeightCharts.IChartApi | undefined
  >();

  const [displayValue, setDisplayValued] = useState(chartCurrentValue);
  const [displayDate, setDisplayDate] = useState(
    new Date().toLocaleDateString(),
  );

  const handleResize = useCallback(() => {
    if (chartCreated && chartRef?.current?.parentElement) {
      chartCreated.resize(
        chartRef.current.offsetWidth - 32,
        chartRef.current.offsetHeight,
      );
      chartCreated.timeScale().fitContent();
      chartCreated.timeScale().scrollToPosition(0, false);
    }
  }, [chartCreated, chartRef]);

  const crosshairMoveHandler = useCallback(
    (param: LightWeightCharts.MouseEventParams<LightWeightCharts.Time>) => {
      const { point, time, seriesData } = param;

      if (point && time && seriesData.size) {
        const data = seriesData.values().next().value;

        let value;
        if (data && 'value' in data) {
          value = data.value; // For LineData or HistogramData
        } else {
          value = chartCurrentValue; // Default fallback
        }

        setDisplayValued(value);
        setDisplayDate(new Date(Number(time) * 1000).toLocaleDateString());
      } else {
        setDisplayValued(chartCurrentValue);
        setDisplayDate(new Date().toLocaleDateString());
      }
    },
    [chartCurrentValue],
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chartRef, handleResize]);

  useEffect(() => {
    if (!chartData && chartCreated && series) {
      chartCreated.remove();
      chartCreated.unsubscribeCrosshairMove(crosshairMoveHandler);
    }
  }, [chartData, chartCreated, series, crosshairMoveHandler]);

  useLayoutEffect(() => {
    if (!chartRef.current || !chartData) return;

    if (chartRef.current.hasChildNodes()) chartRef.current.innerHTML = '';

    const chart = LightWeightCharts.createChart(chartRef.current, {
      width: chartRef.current.parentElement?.clientWidth,
      height: chartRef.current.parentElement?.clientHeight || height,
      layout: {
        background: {
          type: LightWeightCharts.ColorType.Solid,
          color: 'transparent',
        },
        textColor: '#ededed',
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.0)',
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.0)',
        },
      },
      crosshair: {
        mode: LightWeightCharts.CrosshairMode.Magnet,
      },
      leftPriceScale: {
        visible: true,
        borderColor: '#585858',
      },
      rightPriceScale: {
        visible: false,
        borderColor: '#585858',
      },
      timeScale: {
        borderColor: '#585858',
      },
      handleScale: {
        mouseWheel: false,
      },
      handleScroll: {
        pressedMouseMove: false,
        vertTouchDrag: false,
        horzTouchDrag: false,
        mouseWheel: false,
      },
    });

    let series;

    if (chartView === CHART_VIEW.AREA) {
      series = chart?.addAreaSeries({
        topColor: 'rgba(0, 136, 203, 0.6)',
        bottomColor: 'rgba(0, 136, 203, 0.04)',
        lineColor: 'rgba(0, 136, 203, 1)',
        priceScaleId: 'left',
        priceFormat: {
          type: 'custom',
          formatter: (price: LightWeightCharts.BarPrice) =>
            formatCurrency.format(price),
        },
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: 0,
            maxValue: Math.max(...chartData.map((v) => v.value)),
          },
        }),
      });
    } else if (chartView === CHART_VIEW.LINE) {
      series = chart?.addLineSeries({
        color: 'rgba(0, 136, 203, 1)',
        priceScaleId: 'left',
        priceFormat: {
          type: 'custom',
          formatter: (price: LightWeightCharts.BarPrice) =>
            formatCurrency.format(price),
        },
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: 0,
            maxValue: Math.max(...chartData.map((v) => v.value)),
          },
        }),
      });
    } else {
      series = chart?.addHistogramSeries({
        color: 'rgba(0, 136, 203, 1)',
        priceLineVisible: false,
        priceScaleId: 'left',
        priceFormat: {
          type: 'custom',
          formatter: (price: LightWeightCharts.BarPrice) =>
            formatCurrency.format(price),
        },
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: 0,
            maxValue: Math.max(...chartData.map((v) => v.value)),
          },
        }),
      });
    }

    series.setData(chartData);

    chart.timeScale().fitContent();

    setChart(chart);
    setSeries(series);
  }, [chartRef, chartData, chartView]);

  useEffect(() => {
    if (!chartCreated) return undefined;

    chartCreated.subscribeCrosshairMove(crosshairMoveHandler);

    return () => chartCreated.unsubscribeCrosshairMove(crosshairMoveHandler);
  }, [chartCreated, crosshairMoveHandler]);

  useEffect(() => {
    setDisplayValued(chartCurrentValue);
  }, [chartCurrentValue]);

  return (
    <>
      <div className="text-title flex flex-col-reverse items-start px-3 text-left lg:flex-row lg:justify-between lg:px-0">
        <div>
          <div className="mb-2 font-semibold">{chartTitle}</div>

          <div className="mb-2 text-3xl font-semibold">
            {displayValue !== undefined ? (
              formatUSD.format(displayValue)
            ) : chartCurrentValue !== undefined ? (
              formatUSD.format(chartCurrentValue)
            ) : (
              <div className="min-h-[56px]">
                <span className="inline-block h-[24px] w-[24px] animate-[rotate-in_1s_linear_infinite] rounded-full border-2 border-solid border-white border-b-transparent" />
              </div>
            )}
          </div>

          <div className="mb-5 text-sm text-[#b7b7b7]">
            {displayValue !== undefined ? displayDate : null}
          </div>
        </div>

        <div className="mb-8 flex w-full gap-4 md:mb-0 md:w-fit">
          {showTypeSelector && (
            <ChartTypeSelector
              chartType={chartType}
              handleChangeChartType={setChartType}
            />
          )}

          <ChartSpanSelector
            chartSpan={chartSpan}
            handleChangeChartSpan={setChartSpan}
          />
        </div>
      </div>
      <div className="relative">
        <div style={{ height: `${height}px` }} ref={chartRef} />
        {!chartData?.length ? (
          <div className="absolute top-0 flex h-full w-full items-center justify-center">
            <span className="h-[24px] w-[24px] animate-[rotate-in_1s_linear_infinite] rounded-full border-2 border-solid border-white border-b-transparent" />
          </div>
        ) : null}
      </div>
    </>
  );
}

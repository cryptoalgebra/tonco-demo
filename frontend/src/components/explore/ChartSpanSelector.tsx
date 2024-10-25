import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { CHART_SPAN, ChartSpanType } from './types';

interface IChartSpanSelector {
  chartSpan: ChartSpanType;
  handleChangeChartSpan: (span: ChartSpanType) => void;
}

const titles = {
  [CHART_SPAN.DAY]: '1D',
  [CHART_SPAN.WEEK]: '7D',
  [CHART_SPAN.MONTH]: '1M',
  [CHART_SPAN.THREE_MONTH]: '3M',
  [CHART_SPAN.YEAR]: '1Y',
};

function ChartSpanSelector({
  chartSpan,
  handleChangeChartSpan,
}: IChartSpanSelector) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type={'button'}
          className="flex items-center gap-2 rounded-2xl border border-border-light px-4 py-2 text-sm duration-75 hover:bg-lighter"
        >
          <span>{titles[chartSpan]}</span>
          <ChevronDown size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={'end'}
        className="mx-auto flex w-fit flex-col gap-1 rounded-2xl border border-lighter bg-light p-1 text-sm text-white"
      >
        {Object.entries(titles).map(([span, title]) => (
          <button
            type={'button'}
            className={`w-full rounded-full border-2 border-solid px-4 py-2 ${
              span === chartSpan
                ? 'border-primary-blue bg-light'
                : 'border-transparent hover:bg-lighter'
            }`}
            onClick={() => handleChangeChartSpan(span as ChartSpanType)}
          >
            {title}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default ChartSpanSelector;

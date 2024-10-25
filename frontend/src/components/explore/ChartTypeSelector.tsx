import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { CHART_TYPE, ChartTypeType } from './types';

interface IChartTypeSelector {
  chartType: ChartTypeType;
  handleChangeChartType: (span: ChartTypeType) => void;
}

const titles = {
  [CHART_TYPE.TVL]: 'TVL',
  [CHART_TYPE.VOLUME]: 'Volume',
  [CHART_TYPE.FEES]: 'Fees',
  [CHART_TYPE.PRICE]: 'Price',
};

function ChartTypeSelector({
  chartType,
  handleChangeChartType,
}: IChartTypeSelector) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type={'button'}
          className="flex items-center gap-2 rounded-2xl border border-border-light px-4 py-2 text-sm duration-75 hover:bg-lighter"
        >
          <span>{titles[chartType]}</span>
          <ChevronDown size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={'end'}
        className="mx-auto flex w-fit flex-col gap-1 rounded-2xl border border-lighter bg-light p-1 text-sm text-white"
      >
        {Object.entries(titles).map(([type, title]) => (
          <button
            type={'button'}
            className={`w-full rounded-full border-2 border-solid px-4 py-2 text-left ${
              type === chartType
                ? 'border-primary-blue bg-light'
                : 'border-transparent hover:bg-lighter'
            }`}
            onClick={() => handleChangeChartType(type as ChartTypeType)}
          >
            {title}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default ChartTypeSelector;

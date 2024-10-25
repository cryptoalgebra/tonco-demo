import { formatUSD } from 'src/utils/common/formatUSD';
import { CHART_TYPE, ChartTypeType, type ITotalStats } from './types';

function Loader() {
  return (
    <span className="border-title inline-block h-[24px] w-[24px] animate-[rotate-in_1s_linear_infinite] rounded-full border-2 border-solid border-b-transparent" />
  );
}

export default function TotalStats({
  currentTVL,
  currentVolume,
  currentFees,
}: ITotalStats) {
  const cards: {
    title: string;
    type: ChartTypeType;
    value: number | undefined;
    change: number | undefined;
  }[] = [
    {
      title: 'Total Value Locked',
      type: CHART_TYPE.TVL,
      value: currentTVL?.value,
      change: currentTVL?.change,
    },
    {
      title: 'Volume 24H',
      type: CHART_TYPE.VOLUME,
      value: currentVolume?.value,
      change: currentVolume?.change,
    },
    {
      title: 'Fees 24H',
      type: CHART_TYPE.FEES,
      value: currentFees?.value,
      change: currentFees?.change,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-hidden lg:flex-row lg:gap-8 lg:rounded-bl-lg">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`flex flex-1 items-center justify-between rounded-xl border border-border-light bg-light px-4 py-3 md:flex-col md:items-start md:justify-start md:px-6 md:py-4`}
        >
          <div className="text-title whitespace-nowrap text-[16px] md:text-[14px]">
            {card.title}
          </div>
          {card.value !== undefined ? (
            <div className="flex w-full flex-col items-center md:flex-row">
              <div className="text-title ml-auto text-[24px] font-semibold md:ml-0 md:text-[36px]">
                {formatUSD.format(card.value)}
              </div>
              {card.change !== undefined && (
                <div
                  className={`ml-auto ${
                    card.change > 0 ? 'text-[#16A249]' : 'text-[#DC2828]'
                  }`}
                >
                  <span>{card.change > 0 ? '+' : ''}</span>
                  <span>{`${card.change.toFixed(2)}%`}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[54px] items-center">
              <Loader />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

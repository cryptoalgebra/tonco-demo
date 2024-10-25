import { useMemo } from 'react';
import { JettonLogo } from 'src/components/common/JettonLogo';
import {
  Jetton,
  nearestUsableTick,
  Price,
  priceToClosestTick,
  TickMath,
} from '@toncodex/sdk';

interface TokenRatioProps {
  tokenA: Jetton | undefined;
  tokenB: Jetton | undefined;
  price: Price<Jetton, Jetton> | undefined;
  lowerPrice: Price<Jetton, Jetton> | undefined;
  upperPrice: Price<Jetton, Jetton> | undefined;
  tickSpacing: number;
  isSorted?: boolean;
}

function TokenRatio({
  tokenA,
  tokenB,
  price,
  lowerPrice,
  upperPrice,
  isSorted = true,
  tickSpacing,
}: TokenRatioProps) {
  const [token0Ratio, token1Ratio] = useMemo(() => {
    const tickUpperAtLimit =
      upperPrice &&
      nearestUsableTick(TickMath.MAX_TICK, tickSpacing) ===
        priceToClosestTick(upperPrice);
    const currentPrice = price?.toSignificant(5);

    const left = lowerPrice?.toSignificant(5);
    const right = upperPrice?.toSignificant(5);

    if (tickUpperAtLimit) return ['50', '50'];

    if (!currentPrice) return ['0', '0'];

    if (!left && !right) return ['0', '0'];

    if (!left && right) return ['0', '100'];

    if (!right && left) return ['100', '0'];

    if (left && right && currentPrice) {
      const leftRange = +currentPrice - +left;
      const rightRange = +right - +currentPrice;

      const totalSum = +leftRange + +rightRange;

      const leftRate = (+leftRange * 100) / totalSum;
      const rightRate = (+rightRange * 100) / totalSum;

      if (isSorted) {
        return [
          String(rightRate >= 100 ? 100 : rightRate),
          String(leftRate >= 100 ? 100 : leftRate),
        ];
      }
      return [
        String(leftRate >= 100 ? 100 : leftRate),
        String(rightRate >= 100 ? 100 : rightRate),
      ];
    }

    return [null, null];
  }, [isSorted, lowerPrice, price, tickSpacing, upperPrice]);

  if (!token0Ratio && !token1Ratio) return null;

  return (
    <div className="bg-card-dark relative flex h-[30px] rounded-lg">
      <div className="flex h-full w-full font-semibold">
        {Number(token0Ratio) > 0 && (
          <div
            className={`flex h-full items-center justify-end border border-blue-600 bg-blue-800/80 pl-1 pr-2 duration-300 ${
              Number(token0Ratio) === 100 ? 'rounded-xl' : 'rounded-l-xl'
            }`}
            style={{ width: `${token0Ratio}%` }}
          >
            <JettonLogo jetton={tokenA} size={24} className="absolute left-1" />
            {`${Number(token0Ratio).toFixed()}%`}
          </div>
        )}
        {Number(token1Ratio) > 0 && (
          <div
            className={`flex h-full items-center border border-purple-600 bg-purple-800/80 pl-2 pr-1 duration-300 ${
              Number(token1Ratio) === 100 ? 'rounded-xl' : 'rounded-r-xl'
            }`}
            style={{ width: `${token1Ratio}%` }}
          >
            {`${Number(token1Ratio).toFixed()}%`}
            <JettonLogo
              jetton={tokenB}
              size={24}
              className="absolute right-1"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenRatio;

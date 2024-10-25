import { memo, useMemo } from 'react';
import { useUSDValue } from 'src/hooks/jetton/useUSDValue';
import { ExtendedPosition } from 'src/hooks/position/useAllPositions';
import { formatAmount } from 'src/utils/common/formatAmount';
import { formatUnits } from 'src/utils/common/formatUnits';

export const UserStats = memo(
  ({ positions }: { positions: ExtendedPosition[] }) => {
    const nfts = positions.length;

    const [tvl0, tvl1, fees0, fees1] = useMemo(() => {
      let tvl0 = 0;
      let fees0 = 0;
      let tvl1 = 0;
      let fees1 = 0;

      positions.forEach((position) => {
        tvl0 += Number(position.position.amount0.toFixed());
        fees0 += Number(position.feeAmount0);
        tvl1 += Number(position.position.amount1.toFixed());
        fees1 += Number(position.feeAmount1);
      });

      return [
        tvl0,
        tvl1,
        formatUnits(fees0, positions[0].position.amount0.jetton.decimals),
        formatUnits(fees1, positions[0].position.amount1.jetton.decimals),
      ];
    }, [positions]);

    const tvlUSD =
      useUSDValue(tvl0, positions[0].position.amount0.jetton) +
      useUSDValue(tvl1, positions[0].position.amount1.jetton);
    const feesUSD =
      useUSDValue(Number(fees0), positions[0].position.amount0.jetton) +
      useUSDValue(Number(fees1), positions[0].position.amount1.jetton);

    return (
      <div
        style={{
          backgroundImage: 'linear-gradient(to left, #5bc7b3, #39a996)',
        }}
        className="relative flex h-fit w-full animate-fade-in items-center justify-between gap-4 overflow-clip rounded-xl p-4 text-lg text-[#006757] sm:p-6"
      >
        <div className="flex h-full w-fit flex-col items-start">
          <h3 className="text-sm">NFTs</h3>
          <p className="text-2xl font-semibold">{nfts}</p>
        </div>
        <div className="flex h-full w-fit flex-col items-start border-l border-[#006757] pl-4 sm:pl-6">
          <h3 className="text-sm">TVL</h3>
          <p className="text-2xl font-semibold">
            ${formatAmount(tvlUSD.toString(), 2)}
          </p>
        </div>
        <div className="flex h-full w-fit flex-col items-start border-l border-[#006757] pl-4 sm:pl-6">
          <h3 className="text-sm">Fees</h3>
          <p className="text-2xl font-semibold">
            ${formatAmount(feesUSD.toString(), 2)}
          </p>
        </div>
      </div>
    );
  },
);

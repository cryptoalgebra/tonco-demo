import { useAllPools } from 'src/hooks/pool/useAllPools';
import { Address } from '@ton/core';
import { useMemo } from 'react';
import { isDefined } from 'src/utils/common/isDefined';
import { jettons } from 'src/constants/jettons';
import { poolsColumns } from '../common/Table/poolsColumns';
import PoolsTable from '../common/Table/poolsTable';

function PoolsList({
  isExplore,
  jettonId,
}: {
  isExplore?: boolean;
  jettonId?: string;
}) {
  const { pools, isLoading } = useAllPools();

  const formattedPools = useMemo(() => {
    if (!pools) return [];

    return pools
      .filter((pool) => {
        if (jettonId) {
          return (
            Address.parse(pool.jetton0.address).equals(
              Address.parse(jettonId),
            ) ||
            Address.parse(pool.jetton1.address).equals(Address.parse(jettonId))
          );
        }
        return true;
      })
      .map((pool) => {
        if (!pool) return null;

        /* convert pTON to TON */
        const token0 = pool.jetton0.equals(jettons.TON)
          ? jettons.TON
          : pool.jetton0;
        const token1 = pool.jetton1.equals(jettons.TON)
          ? jettons.TON
          : pool.jetton1;
        const tvlUSD = pool.totalValueLockedUsd;
        const volume24USD = pool.volumeUsd;
        const fees24USD = pool.feesUsd;

        return {
          id: Address.parse(pool.address).toString(),
          pair: {
            token0,
            token1,
          },
          fee: pool.fee,
          tvlUSD,
          volume24USD,
          fees24USD,
          avgApr: 0,
          isMyPool: false,
        };
      })
      .filter(isDefined);
  }, [pools, jettonId]);

  return (
    <div className="flex w-full flex-col gap-4">
      <PoolsTable
        columns={poolsColumns}
        data={formattedPools}
        defaultSortingID={'tvlUSD'}
        link={isExplore ? 'explore/pools' : 'pool'}
        showPagination
        loading={isLoading}
      />
    </div>
  );
}

export default PoolsList;

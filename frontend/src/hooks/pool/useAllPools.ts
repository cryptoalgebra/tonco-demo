import { useMemo } from 'react';
import { Jetton } from '@toncodex/sdk';
import { useAllPoolsQuery } from 'src/graphql/generated/graphql';

interface PoolData {
  address: string;
  name: string;
  positionsCount: number;
  jetton0: Jetton;
  jetton1: Jetton;
  isInitialized: boolean;
  fee: number;
  liquidity: string;
  tick: number;
  tickSpacing: number;
  priceSqrt: string;
  feeGrowthGlobal0X128: string;
  feeGrowthGlobal1X128: string;
  jetton0Price: number;
  jetton1Price: number;
  volumeUsd: number;
  feesUsd: number;
  txCount: number;
  collectedFeesUsd: number;
  totalValueLockedUsd: number;
}

export function useAllPools() {
  const { data, loading: isLoading } = useAllPoolsQuery({
    pollInterval: 20000,
  });

  const pools = useMemo(() => {
    if (!data?.pools) return undefined;
    const tempPools: PoolData[] = [];
    for (const pool of data.pools) {
      if (!pool) return undefined;

      tempPools.push({
        ...pool,
        jetton0: new Jetton(
          pool.jetton0.address,
          pool.jetton0.decimals,
          pool.jetton0.symbol,
          pool.jetton0.name,
          pool.jetton0.image,
        ),
        jetton1: new Jetton(
          pool.jetton1.address,
          pool.jetton1.decimals,
          pool.jetton1.symbol,
          pool.jetton1.name,
          pool.jetton1.image,
        ),
      });
    }

    console.log(tempPools);
    return tempPools;
  }, [data]);

  return { pools, isLoading };
}

import { TonClient } from '@ton/ton';
import { Address, OpenedContract } from '@ton/core';
import {
  Jetton,
  Pool,
  PoolStateAndConfiguration,
  PoolV3Contract,
} from '@toncodex/sdk';
import useSWR from 'swr';
import { PoolState, PoolStateType } from 'src/types/pool-state';
import { useMemo } from 'react';
import JSBI from 'jsbi';
import { useJetton } from '../jetton/useJetton';
import { useTonClient } from '../common/useTonClient';

export interface PoolData extends PoolStateAndConfiguration {
  poolAddress: Address;
  jetton0: Jetton;
  jetton1: Jetton;
}

export const fetchPoolData = async (
  client: TonClient | null,
  poolAddress: string | undefined,
) => {
  if (!client || !poolAddress)
    throw new Error("Can't fetch pool without ton client or pool address");
  const contract = new PoolV3Contract(Address.parse(poolAddress));
  const poolContract = client.open(contract) as OpenedContract<PoolV3Contract>;

  try {
    await poolContract.getPoolStateAndConfiguration();
  } catch (e) {
    console.error(e);
  }
  return poolContract.getPoolStateAndConfiguration();
};

export const usePoolData = (poolAddress: string | undefined) => {
  const client = useTonClient();

  const {
    data,
    error: isError,
    isLoading,
    mutate,
  } = useSWR(
    poolAddress ? [client, poolAddress] : null,
    () => fetchPoolData(client, poolAddress),
    {
      revalidateOnMount: true,
    },
  );

  const jetton0 = useJetton(data?.jetton0_minter.toString());
  const jetton1 = useJetton(data?.jetton1_minter.toString());

  return useMemo(() => {
    if (!jetton0 || !jetton1)
      return { data: undefined, isError: false, isLoading: true, mutate };
    if (!data || !poolAddress)
      return { data: undefined, isError, isLoading, mutate };

    return {
      data: {
        ...data,
        jetton0,
        jetton1,
        poolAddress: Address.parse(poolAddress),
      },
      isError,
      isLoading,
      mutate,
    };
  }, [data, isError, isLoading, jetton0, jetton1, mutate, poolAddress]);
};

export function usePoolV3(
  poolAddress: string | undefined,
): [PoolStateType, Pool | null] {
  const {
    data: poolData,
    isError: isPoolError,
    isLoading: isPoolLoading,
  } = usePoolData(poolAddress);

  return useMemo(() => {
    if (!poolData && isPoolLoading) return [PoolState.LOADING, null];
    if (!poolData?.tick_spacing || poolData?.liquidity === undefined)
      return [PoolState.NOT_EXISTS, null];
    if ((!poolData && !isPoolLoading) || isPoolError)
      return [PoolState.INVALID, null];

    const pool = new Pool(
      poolData.jetton0,
      poolData.jetton1,
      poolData.lp_fee_current,
      JSBI.BigInt(poolData.price_sqrt.toString()), // tick === 0 && price_sqrt === 0n ? TickMath.getSqrtRatioAtTick(0), : price_sqrt,
      poolData.liquidity.toString(),
      poolData.tick,
      poolData.tick_spacing,
      undefined,
      poolData.jetton0_wallet.toString(),
      poolData.jetton1_wallet.toString(),
    );

    return [PoolState.EXISTS, pool];
  }, [isPoolLoading, isPoolError, poolData]);
}

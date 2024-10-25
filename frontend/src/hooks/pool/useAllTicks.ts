import { useEffect, useState } from 'react';
import { PoolV3Contract } from '@toncodex/sdk';
import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';
import { useTonClient } from '../common/useTonClient';

export interface GraphTick {
  tickIdx: string;
  liquidityGross: string;
  liquidityNet: string;
}

export async function getAllTicks(
  client: TonClient | null,
  poolAddress: string | undefined,
): Promise<GraphTick[] | undefined> {
  if (!client || !poolAddress) return undefined;
  const contract = new PoolV3Contract(Address.parse(poolAddress));
  const poolV3Contract = client.open(contract);

  const tickInfos = await poolV3Contract.getTickInfosAll();

  const ticks = tickInfos.map((tick) => ({
    tickIdx: tick.tickNum.toString(),
    liquidityGross: tick.liquidityGross.toString(),
    liquidityNet: tick.liquidityNet.toString(),
  }));

  const sortedTicks = ticks.sort(
    (a, b) => Number(a.tickIdx) - Number(b.tickIdx),
  );

  console.log('ticks from contract', sortedTicks);

  return sortedTicks;
}

export function useAllTicks(poolAddress: string | undefined) {
  const [ticks, setTicks] = useState<GraphTick[] | undefined>();
  const client = useTonClient();

  useEffect(() => {
    if (!poolAddress || !client) return;
    getAllTicks(client, poolAddress).then(setTicks);
  }, [poolAddress, client]);

  return ticks;
}

import { Address, OpenedContract } from '@ton/core';
import { PoolV3Contract } from '@toncodex/sdk';
import { useAsyncInitialize } from '../common/useAsyncInitialize';
import { useTonClient } from '../common/useTonClient';

export function usePoolV3Contract(poolAddress: string | undefined) {
  const client = useTonClient();

  const poolV3Contract = useAsyncInitialize(async () => {
    if (!client || !poolAddress) return undefined;

    const contract = new PoolV3Contract(Address.parse(poolAddress));

    return client.open(contract) as OpenedContract<PoolV3Contract>;
  }, [client, poolAddress]);

  return poolV3Contract;
}

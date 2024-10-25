import { Address, OpenedContract } from '@ton/core';
import { PositionNFTV3Contract } from '@toncodex/sdk';
import { useAsyncInitialize } from '../common/useAsyncInitialize';
import { useTonClient } from '../common/useTonClient';

export function usePositionNFTV3Contract(nftAddress: string | undefined) {
  const client = useTonClient();

  const positionNFTV3Contract = useAsyncInitialize(async () => {
    if (!client || !nftAddress) return undefined;

    const contract = new PositionNFTV3Contract(Address.parse(nftAddress));

    return client.open(contract) as OpenedContract<PositionNFTV3Contract>;
  }, [client, nftAddress]);

  return positionNFTV3Contract;
}

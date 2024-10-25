import { Address, OpenedContract } from '@ton/core';
import { JettonMinter } from '@toncodex/sdk';
import { useAsyncInitialize } from '../common/useAsyncInitialize';
import { useTonClient } from '../common/useTonClient';

export function useJettonMinterContract(jettonMinter: string | undefined) {
  const client = useTonClient();

  const poolV3Contract = useAsyncInitialize(async () => {
    if (!client || !jettonMinter) return undefined;

    const contract = new JettonMinter(Address.parse(jettonMinter));

    return client.open(contract) as OpenedContract<JettonMinter>;
  }, [client, jettonMinter]);

  return poolV3Contract;
}

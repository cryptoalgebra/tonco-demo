import { Address, OpenedContract } from '@ton/core';
import { JettonWallet } from '@toncodex/sdk';
import { useAsyncInitialize } from '../common/useAsyncInitialize';
import { useTonClient } from '../common/useTonClient';

export function useJettonWalletContract(jettonWallet: string | undefined) {
  const client = useTonClient();

  const poolV3Contract = useAsyncInitialize(async () => {
    if (!client || !jettonWallet) return undefined;

    const contract = new JettonWallet(Address.parse(jettonWallet));

    return client.open(contract) as OpenedContract<JettonWallet>;
  }, [client, jettonWallet]);

  return poolV3Contract;
}

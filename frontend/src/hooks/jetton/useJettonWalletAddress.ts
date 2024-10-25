import { Address } from '@ton/core';
import { JettonMinter } from '@toncodex/sdk';
import useSWR from 'swr';
import { TonClient } from '@ton/ton';
import { useTonClient } from '../common/useTonClient';

interface Props {
  jettonMinterAddress: string | undefined;
  ownerAddress: string | null | undefined;
}

const fetchJettonWallet = (
  client: TonClient | null,
  jettonMinterAddress: string | undefined,
  ownerAddress: string | null | undefined,
) => {
  if (!client || !jettonMinterAddress || !ownerAddress)
    throw new Error(
      "Can't fetch jetton wallet without ton client or jetton minter address or owner address",
    );
  const contract = new JettonMinter(Address.parse(jettonMinterAddress));
  const jettonWalletContract = client.open(contract);

  return jettonWalletContract.getWalletAddress(Address.parse(ownerAddress));
};

export function useJettonWalletAddress({
  jettonMinterAddress,
  ownerAddress,
}: Props) {
  const client = useTonClient();

  const {
    data: jettonWalletAddress,
    // isLoading,
    // isValidating,
    // mutate,
  } = useSWR(
    [client, jettonMinterAddress, ownerAddress],
    () => fetchJettonWallet(client, jettonMinterAddress, ownerAddress),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    },
  );

  // /* fallback */
  // useEffect(() => {
  //     if (!jettonWalletAddress && !isLoading && !isValidating && client && jettonMinterAddress && ownerAddress) {
  //         mutate();
  //     }
  // }, [jettonWalletAddress, isLoading, isValidating, client, jettonMinterAddress, ownerAddress, mutate]);

  return jettonWalletAddress?.toString();
}

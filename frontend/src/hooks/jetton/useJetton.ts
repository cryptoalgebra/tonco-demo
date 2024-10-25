import { Address, OpenedContract } from '@ton/core';
import { useEffect, useState } from 'react';
import { useTokensState } from 'src/state/tokensStore';
import { Jetton, JettonMinter, JettonWallet } from '@toncodex/sdk';
import { parseJettonContent } from 'src/utils/jetton/parseJettonContent';
import useSWR from 'swr';
import { TonClient } from '@ton/ton';
import { useTonClient } from '../common/useTonClient';
import { useJettonMinterContract } from '../contracts/useJettonMinterContract';

export function useJetton(
  jettonMinterAddress: string | undefined,
): Jetton | undefined {
  const [jetton, setJetton] = useState<Jetton>();
  const { importedTokens } = useTokensState();
  const jettonMinter = useJettonMinterContract(jettonMinterAddress);

  useEffect(() => {
    if (!jettonMinterAddress || !jettonMinter) return;
    const allTokens = Object.values(importedTokens);
    const token = allTokens.find((jetton) =>
      Address.parse(jetton.address).equals(Address.parse(jettonMinterAddress)),
    );
    if (token) {
      setJetton(
        new Jetton(
          token.address,
          token.decimals,
          token.symbol,
          token.name,
          token.image,
        ),
      );
      return;
    }

    jettonMinter
      .getJettonData()
      .then((data) =>
        setJetton(parseJettonContent(jettonMinterAddress, data.content)),
      );
  }, [jettonMinterAddress, jettonMinter, importedTokens]);

  return jetton;
}

export async function fetchJettonMinterAddress(
  client: TonClient | null,
  jettonWallet: string | undefined,
) {
  if (!client || !jettonWallet)
    throw new Error(
      "Can't fetch jetton minter without ton client or jetton wallet address",
    );
  const contract = new JettonWallet(Address.parse(jettonWallet));
  const jettonWalletContract = client.open(
    contract,
  ) as OpenedContract<JettonWallet>;

  return jettonWalletContract.getJettonMinterAddress();
}

export function useJettonByJettonWallet(
  jettonWalletAddress: string | undefined,
): Jetton | undefined {
  const client = useTonClient();

  const { data: jettonAddress } = useSWR(
    ['jettonAddress', client, jettonWalletAddress],
    () => fetchJettonMinterAddress(client, jettonWalletAddress),
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  );

  const jetton = useJetton(jettonAddress?.toString());

  return jetton;
}

export async function fetchJettonData(
  client: TonClient | null,
  jettonMinter: string | undefined,
) {
  if (!client || !jettonMinter)
    throw new Error(
      "Can't fetch jetton minter without ton client or jetton minter address",
    );
  const contract = new JettonMinter(Address.parse(jettonMinter));
  const jettonMinterContract = client.open(contract);
  return jettonMinterContract.getJettonData();
}

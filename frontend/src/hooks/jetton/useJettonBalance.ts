import { useMemo } from 'react';
import { Api, JettonVerificationType } from 'tonapi-sdk-js';
import useSWR from 'swr';
import { Address, fromNano } from '@ton/core';
import { jettons } from 'src/constants/jettons';
import { useTonConsoleClient } from '../common/useTonConsoleClient';

async function fetchBalances(client: Api<unknown>, wallet: string | null) {
  if (!client || !wallet)
    throw new Error("Can't fetch balances without ton client or wallet");

  const balances = await client.accounts.getAccountJettonsBalances(
    Address.parse(wallet).toString(),
  );
  const tonBalance = (await client.accounts.getAccount(wallet)).balance;

  console.log('ton balance:', fromNano(tonBalance));

  return balances.balances.concat({
    balance: tonBalance.toFixed(),
    wallet_address: {
      address: wallet, // not unused, should be user's TON jetton wallet
      is_scam: false,
      is_wallet: false,
    },
    jetton: {
      ...jettons.TON,
      verification: JettonVerificationType.None,
      name: 'TON',
      image: jettons.TON.image!,
    },
  });
}

function useAccountBalances(wallet: string | null) {
  const client = useTonConsoleClient();

  const { data: balances } = useSWR(
    ['accountBalances', wallet],
    () => fetchBalances(client, wallet),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      refreshInterval: 10000,
    },
  );

  return balances;
}

export function useJettonBalance(
  jettonAddress: string | undefined,
  wallet: string | null,
) {
  const balances = useAccountBalances(wallet);

  return useMemo(() => {
    if (!wallet) return '';
    if (!jettonAddress || !balances) return undefined;

    const jettonBalance = balances.filter((jb) =>
      Address.parse(jb.jetton.address).equals(Address.parse(jettonAddress)),
    );

    if (jettonBalance.length === 0) return '';

    return jettonBalance[0].balance;
  }, [balances, jettonAddress, wallet]);
}

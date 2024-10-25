import { CHAIN, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Cell, SenderArguments } from '@ton/core';
import { useUserState } from 'src/state/userStore';
import { WalletVersion, parseWalletVersion } from '@toncodex/sdk';
import { Api } from 'tonapi-sdk-js';
import useSWR from 'swr';
import { useTonConsoleClient } from './useTonConsoleClient';

const fetchWalletVersion = async (
  client: Api<unknown>,
  address: string | undefined,
) => {
  if (!address) throw new Error("Can't fetch wallet version without address");
  const accInfo = await client.accounts.getAccount(address);
  return accInfo.interfaces?.[0];
};

export type Sender = {
  send: (args: SenderArguments) => Promise<string>;
  sendMiltiple: (args: SenderArguments[]) => Promise<string>;
};

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | undefined;
  wallet_public_key: string | null;
  walletVersion: WalletVersion | undefined;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { txDeadline } = useUserState();

  const client = useTonConsoleClient();

  const { data: version } = useSWR(
    wallet ? ['walletVersion', wallet?.account.address] : null,
    () => fetchWalletVersion(client, wallet?.account.address),
  );

  return {
    sender: {
      send: async (args: SenderArguments) => {
        const tx = await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + txDeadline * 1000,
        });

        const cell = Cell.fromBase64(tx.boc);
        const buffer = cell.hash();
        const txHash = buffer.toString('hex');

        return txHash;
      },
      sendMiltiple: async (args: SenderArguments[]) => {
        const tx = await tonConnectUI.sendTransaction({
          messages: args.map((arg) => ({
            address: arg.to.toString(),
            amount: arg.value.toString(),
            payload: arg.body?.toBoc().toString('base64'),
          })),
          validUntil: Date.now() + txDeadline * 1000,
        });

        const cell = Cell.fromBase64(tx.boc);
        const buffer = cell.hash();
        const txHash = buffer.toString('hex');

        return txHash;
      },
    },
    connected: !!wallet?.account.address,
    wallet: wallet?.account.address ?? null,
    network: wallet?.account.chain,
    wallet_public_key: wallet?.account.publicKey ?? null,
    walletVersion: wallet && version ? parseWalletVersion(version) : undefined,
  };
}

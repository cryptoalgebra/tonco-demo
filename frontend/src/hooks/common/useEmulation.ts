import { Api } from 'tonapi-sdk-js';
import {
  Address,
  beginCell,
  Cell,
  external,
  internal,
  SenderArguments,
  SendMode,
  storeMessage,
  WalletContractV4,
} from '@ton/ton';
import { sign } from '@ton/crypto';
import useSWR from 'swr';
import { useTonConnect } from './useTonConnect';
import { useTonConsoleClient } from './useTonConsoleClient';

const signer = async (message: Cell): Promise<Buffer> =>
  sign(message.hash(), Buffer.alloc(64));

const externalMessage = (
  contract: WalletContractV4,
  seqno: number,
  body: Cell,
) =>
  beginCell()
    .storeWritable(
      storeMessage(
        external({
          to: contract.address,
          init: seqno === 0 ? contract.init : undefined,
          body: body,
        }),
      ),
    )
    .endCell();

export async function getEmulateMessage(
  client: Api<unknown>,
  messages: SenderArguments[] | undefined,
  wallet: string | null,
  walletPubKey: string | null,
) {
  if (!wallet || !walletPubKey || !messages || !messages[0].body)
    return undefined;
  const walletContract = WalletContractV4.create({
    workchain: Address.parse(wallet).workChain,
    publicKey: Buffer.from(walletPubKey, 'hex'),
  });

  const seqno = (await client.wallet.getAccountSeqno(wallet)).seqno;

  const secretKey = await signer(messages[0].body);

  /* replace secretKey by signer if @ton/ton ver. ^14.0.0 */
  const transfer = walletContract.createTransfer({
    seqno,
    // signer,
    secretKey,
    timeout: 0,
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    messages: messages.map((message) =>
      internal({
        to: message.to,
        bounce: true,
        value: message.value,
        init: {
          code: message.init?.code ?? null,
          data: message.init?.data ?? null,
        },
        body: message.body,
      }),
    ),
  });

  const msgCell = externalMessage(walletContract, seqno, transfer).toBoc({
    idx: false,
  });

  const emulation = await client.wallet.emulateMessageToWallet({
    boc: msgCell.toString('base64'),
  });

  return emulation;
}

export function useEmulation(messages: SenderArguments[] | undefined) {
  const client = useTonConsoleClient();
  const { wallet, wallet_public_key: walletPubKey } = useTonConnect();

  const { data, isLoading, error } = useSWR(
    [messages, wallet, walletPubKey],
    () => getEmulateMessage(client, messages, wallet, walletPubKey),
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SwapCallbackState } from 'src/types/swap-state';
import { Field, Percent, ZERO, PoolMessageManager } from '@toncodex/sdk';
import { IDerivedMintInfo } from 'src/state/mintStore';
import { Address, fromNano, SenderArguments } from '@ton/core';
import { useParams } from 'react-router-dom';
import JSBI from 'jsbi';
import {
  TransactionFeeState,
  TransactionFeeStatus,
} from 'src/types/transaction-fee-state';
import { useTransactionAwait } from '../common/useTransactionAwait';
import { useJettonWalletAddress } from '../jetton/useJettonWalletAddress';
import { useTonConnect } from '../common/useTonConnect';
import { useTonConsoleClient } from '../common/useTonConsoleClient';
import { useDebounce } from '../common/useDebounce';

export function useMintCallback(
  mintInfo: IDerivedMintInfo,
  setTransactionFee: (transactionFee: TransactionFeeState) => void,
  slippage: Percent,
) {
  const [messages, setMessages] = useState<SenderArguments[]>();
  const [txHash, setTxHash] = useState<string>();
  const {
    sender,
    wallet,
    wallet_public_key: walletPubKey,
    walletVersion,
  } = useTonConnect();
  const client = useTonConsoleClient();

  const { poolId } = useParams();

  const position = mintInfo.position;
  const debouncedPosition = useDebounce(position, 500);
  const pool = mintInfo.pool;

  const jetton0 = mintInfo.currencies[Field.CURRENCY_A];
  const jetton1 = mintInfo.currencies[Field.CURRENCY_B];

  const isSorted = pool && jetton0?.equals(pool.jetton0);

  const jetton0Wallet = useJettonWalletAddress({
    jettonMinterAddress: jetton0?.address,
    ownerAddress: wallet,
  });
  const jetton1Wallet = useJettonWalletAddress({
    jettonMinterAddress: jetton1?.address,
    ownerAddress: wallet,
  });

  const routerJetton0Wallet = isSorted
    ? pool.jetton0_wallet
    : pool?.jetton1_wallet;
  const routerJetton1Wallet = isSorted
    ? pool.jetton1_wallet
    : pool?.jetton0_wallet;

  useEffect(() => {
    if (
      !wallet ||
      !jetton0Wallet ||
      !jetton1Wallet ||
      !debouncedPosition ||
      !routerJetton0Wallet ||
      !routerJetton1Wallet ||
      !walletPubKey
    )
      return;
    if (JSBI.equal(debouncedPosition.liquidity, ZERO)) return;

    setTransactionFee({
      status: TransactionFeeStatus.LOADING,
      fee: undefined,
      gasForward: undefined,
      gasLimit: undefined,
    });

    PoolMessageManager.createEmulatedMintMessage(
      Address.parse(routerJetton0Wallet),
      Address.parse(routerJetton1Wallet),
      Address.parse(jetton0Wallet),
      Address.parse(jetton1Wallet),
      debouncedPosition,
      Address.parse(wallet),
      slippage,
      client,
      walletPubKey,
      walletVersion,
    ).then((messages) => {
      setTransactionFee({
        status: TransactionFeeStatus.SUCCESS,
        fee: fromNano(messages.txFee),
        gasForward: fromNano(messages.forwardGas),
        gasLimit: fromNano(messages.gasLimit),
      });
      setMessages(messages.messages);
    });
  }, [
    jetton0Wallet,
    jetton1Wallet,
    debouncedPosition,
    routerJetton0Wallet,
    routerJetton1Wallet,
    slippage,
    wallet,
    walletPubKey,
    walletVersion,
  ]);

  const mintCallback = useCallback(async () => {
    if (!messages) return;

    const tx = await sender.sendMiltiple(messages.reverse());
    setTxHash(tx);
  }, [messages, sender]);

  const { isLoading, isError } = useTransactionAwait(
    txHash,
    {
      title: 'Mint',
    },
    `/pool/${poolId?.toString()}`,
  );

  return useMemo(
    () => ({
      state: SwapCallbackState.VALID,
      callback: mintCallback,
      isError,
      isLoading,
    }),
    [isError, isLoading, mintCallback],
  );
}

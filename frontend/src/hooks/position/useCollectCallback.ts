import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, fromNano, SenderArguments } from '@ton/core';
import { PoolMessageManager } from '@toncodex/sdk';
import { IDerivedBurnInfo } from 'src/state/burnStore';
import {
  TransactionFeeState,
  TransactionFeeStatus,
} from 'src/types/transaction-fee-state';
import { useTonConnect } from '../common/useTonConnect';
import { useTransactionAwait } from '../common/useTransactionAwait';
import { useTonConsoleClient } from '../common/useTonConsoleClient';

export function useCollectCallback(
  tokenId: number,
  burnInfo: IDerivedBurnInfo | undefined,
  setTxFeeState: (state: TransactionFeeState) => void,
) {
  const [message, setMessage] = useState<SenderArguments>();
  const [txHash, setTxHash] = useState<string>();
  const client = useTonConsoleClient();
  const { wallet, wallet_public_key, sender, walletVersion } = useTonConnect();

  useEffect(() => {
    if (
      !burnInfo?.poolAddress ||
      !burnInfo.position ||
      !wallet ||
      !wallet_public_key
    )
      return;

    setTxFeeState({
      status: TransactionFeeStatus.LOADING,
      fee: undefined,
      gasForward: undefined,
      gasLimit: undefined,
    });

    PoolMessageManager.createEmulatedCollectMessage(
      Address.parse(burnInfo.poolAddress),
      tokenId,
      burnInfo.position.tickLower,
      burnInfo.position.tickUpper,
      burnInfo.feeValue0,
      burnInfo.feeValue1,
      client,
      wallet,
      wallet_public_key,
      walletVersion,
    ).then((message) => {
      setTxFeeState({
        status: TransactionFeeStatus.SUCCESS,
        fee: fromNano(message.txFee),
        gasForward: fromNano(message.forwardGas),
        gasLimit: fromNano(message.gasLimit),
      });
      setMessage(message.message);
    });
  }, [
    burnInfo?.poolAddress,
    burnInfo?.position,
    burnInfo?.feeValue0,
    burnInfo?.feeValue1,
    setTxFeeState,
    tokenId,
    wallet,
    wallet_public_key,
    walletVersion,
  ]);

  const burnCallback = useCallback(async () => {
    if (!message) return;

    const tx = await sender.send(message);

    setTxHash(tx);
  }, [message, sender]);

  const { isLoading, isError } = useTransactionAwait(txHash, {
    title: 'Burn',
    description: 'Transaction was sent',
  });

  return useMemo(
    () => ({
      callback: burnCallback,
      isError,
      isLoading,
    }),
    [burnCallback, isError, isLoading],
  );
}

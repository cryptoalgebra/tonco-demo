import { useCallback, useEffect, useMemo, useState } from 'react';
import { IDerivedBurnInfo } from 'src/state/burnStore';
import { Address, fromNano, SenderArguments } from '@ton/core';
import { PoolMessageManager } from '@toncodex/sdk';
import {
  TransactionFeeState,
  TransactionFeeStatus,
} from 'src/types/transaction-fee-state';
import { useTransactionAwait } from '../common/useTransactionAwait';
import { useTonConnect } from '../common/useTonConnect';
import { useTonConsoleClient } from '../common/useTonConsoleClient';
import { useDebounce } from '../common/useDebounce';

export function useBurnCallback(
  tokenId: number,
  burnInfo: IDerivedBurnInfo | undefined,
  setTxFeeState: (state: TransactionFeeState) => void,
) {
  const [message, setMessage] = useState<SenderArguments>();
  const [txHash, setTxHash] = useState<string>();
  const client = useTonConsoleClient();
  const { wallet, wallet_public_key, sender, walletVersion } = useTonConnect();

  const liquidityToBurn = useDebounce(burnInfo?.liquidityToBurn, 500);

  useEffect(() => {
    if (
      !burnInfo?.poolAddress ||
      !liquidityToBurn ||
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

    const amount0 = burnInfo.liquidityValue0;
    const amount1 = burnInfo.liquidityValue1;
    const feeAmount0 = burnInfo.feeValue0;
    const feeAmount1 = burnInfo.feeValue1;

    PoolMessageManager.createEmulatedBurnMessage(
      Address.parse(burnInfo.poolAddress),
      tokenId,
      burnInfo.position.tickLower,
      burnInfo.position.tickUpper,
      BigInt(liquidityToBurn.toString()),
      amount0,
      amount1,
      feeAmount0,
      feeAmount1,
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
    liquidityToBurn, // debounced liquidityToBurn instead of liquidityValue0 / 1
    setTxFeeState,
    tokenId,
    wallet,
    wallet_public_key,
    walletVersion,
    // burnInfo?.feeValue0,
    // burnInfo?.feeValue1,
  ]);

  const burnCallback = useCallback(async () => {
    if (!message) return;

    const tx = await sender.send(message);

    console.log(tx);

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

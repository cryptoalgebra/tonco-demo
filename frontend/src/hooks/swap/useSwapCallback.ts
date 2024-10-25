import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, fromNano, SenderArguments } from '@ton/core';
import { SwapCallbackState } from 'src/types/swap-state';
import {
  Jetton,
  Percent,
  Pool,
  TickMath,
  Trade,
  TradeType,
  ZERO,
  SwapType,
  PoolMessageManager,
} from '@toncodex/sdk';
import { jettons } from 'src/constants/jettons';
import { useSwapState } from 'src/state/swapStore';
import { TransactionFeeStatus } from 'src/types/transaction-fee-state';
import { useTonConsoleClient } from '../common/useTonConsoleClient';
import { useTransactionAwait } from '../common/useTransactionAwait';
import { useJettonWalletAddress } from '../jetton/useJettonWalletAddress';
import { useTonConnect } from '../common/useTonConnect';

export function useSwapCallback({
  trade,
  allowedSlippage,
  pool,
}: {
  trade: Trade<Jetton, Jetton, TradeType> | undefined;
  allowedSlippage: Percent;
  pool: Pool | null | undefined;
}) {
  const {
    sender,
    wallet,
    wallet_public_key: walletPubKey,
    walletVersion,
  } = useTonConnect();
  const client = useTonConsoleClient();

  const {
    actions: { setTransactionFee },
  } = useSwapState();
  const [txHash, setTxHash] = useState<string>();

  const [message, setMessage] = useState<SenderArguments>();

  const jetton0 = trade?.inputAmount.jetton;
  const jetton1 = trade?.outputAmount.jetton;
  const amountIn = trade?.inputAmount.quotient.toString();

  const zeroToOne = jetton0 && pool && jetton0.equals(pool.jetton0);

  /* jetton0 wallet attached to user */
  const userJettonWallet = useJettonWalletAddress({
    jettonMinterAddress: jetton0?.address,
    ownerAddress: wallet,
  });

  /* jetton1 wallet attached to router */
  const routerJettonWallet = zeroToOne
    ? pool.jetton1_wallet
    : pool?.jetton0_wallet;

  useEffect(() => {
    if (
      !trade ||
      !userJettonWallet ||
      !routerJettonWallet ||
      !wallet ||
      !amountIn ||
      !walletPubKey
    )
      return;
    const isTonToJetton = jetton0 && jetton0.equals(jettons.TON);
    const isJettonToTon = jetton1 && jetton1?.equals(jettons.TON);

    const swapType = isTonToJetton
      ? SwapType.TON_TO_JETTON
      : isJettonToTon
        ? SwapType.JETTON_TO_TON
        : SwapType.JETTON_TO_JETTON;

    const minimumAmountOut = trade
      .minimumAmountOut(allowedSlippage)
      .equalTo(ZERO)
      ? trade.outputAmount.quotient.toString()
      : trade.minimumAmountOut(allowedSlippage).quotient.toString();

    const priceLimitSqrt = zeroToOne
      ? BigInt(TickMath.MIN_SQRT_RATIO.toString()) + 1n
      : BigInt(TickMath.MAX_SQRT_RATIO.toString()) - 1n;

    setTransactionFee({
      status: TransactionFeeStatus.LOADING,
      fee: undefined,
      gasForward: undefined,
      gasLimit: undefined,
    });

    PoolMessageManager.createEmulatedSwapExactInMessage(
      Address.parse(userJettonWallet),
      Address.parse(routerJettonWallet),
      Address.parse(wallet),
      BigInt(amountIn),
      BigInt(minimumAmountOut),
      priceLimitSqrt,
      swapType,
      client,
      walletPubKey,
      walletVersion,
    ).then((message) => {
      setMessage({
        to: message.message.to,
        value: message.message.value,
        body: message.message.body,
      });
      setTransactionFee({
        status: TransactionFeeStatus.SUCCESS,
        fee: fromNano(message.txFee),
        gasForward: fromNano(message.forwardGas),
        gasLimit: fromNano(message.gasLimit),
      });
    });
  }, [
    trade,
    userJettonWallet,
    routerJettonWallet,
    wallet,
    amountIn,
    jetton0,
    allowedSlippage,
    zeroToOne,
    walletPubKey,
    walletVersion,
    setTransactionFee,
  ]);

  const swapCallback = useCallback(async () => {
    if (!message) return;

    const tx = await sender.send(message);
    setTxHash(tx);
  }, [message, sender]);

  const { isLoading, isError } = useTransactionAwait(txHash, {
    title: 'Swap',
  });

  return useMemo(
    () => ({
      state: SwapCallbackState.VALID,
      callback: swapCallback,
      isLoading,
      isError,
    }),
    [swapCallback, isError, isLoading],
  );
}

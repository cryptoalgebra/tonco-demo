import { useMemo } from 'react';
import { BlockchainFeeMenu } from 'src/components/common/BlockchainFeeMenu';
import { jettons } from 'src/constants/jettons';
import { cn } from 'src/lib/cn';
import { Percent, TradeType } from '@toncodex/sdk';
import { IDerivedSwapInfo, useSwapState } from 'src/state/swapStore';
import { TradeState } from 'src/types/trade-state';
import {
  computeRealizedLPFeePercent,
  warningSeverity,
} from 'src/utils/swap/prices';

function PriceImpact({ priceImpact }: { priceImpact: Percent | undefined }) {
  const severity = warningSeverity(priceImpact);

  const color =
    severity === 3 || severity === 4
      ? 'text-red-400'
      : severity === 2
        ? 'text-yellow-400'
        : 'text-white';

  return (
    <span className={color}>
      {priceImpact ? `${priceImpact.multiply(-1).toFixed(2)}%` : ''}
    </span>
  );
}

export function SwapParams({ swapInfo }: { swapInfo: IDerivedSwapInfo }) {
  const { transactionFee } = useSwapState();

  const { tradeState, toggledTrade: trade, allowedSlippage } = swapInfo;

  const tonDeltaSwapAmount = trade?.outputAmount.jetton.equals(jettons.TON)
    ? Number(trade?.outputAmount.toSignificant(12))
    : trade?.inputAmount.jetton.equals(jettons.TON)
      ? Number(`-${trade?.inputAmount.toSignificant(12)}`)
      : 0;

  const adaptiveFee = useMemo(() => {
    if (!tradeState.fee) return undefined;

    let p = 100;

    for (const fee of tradeState.fee) {
      p *= 1 - Number(fee) / 1_000_000;
    }

    return (100 - p).toFixed(2);
  }, [tradeState.fee]);

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined };

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade);
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent);
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent);
    return { priceImpact, realizedLPFee };
  }, [trade]);

  const LPFeeString = realizedLPFee
    ? `${realizedLPFee.toSignificant(4)} ${realizedLPFee.jetton.symbol}`
    : '-';

  const isLoading = tradeState.state === TradeState.LOADING;

  const isInvalid = !trade && tradeState.state === TradeState.INVALID;

  return (
    <div
      className={cn(
        'mt-2 flex w-full flex-col gap-2 overflow-hidden p-2 transition-[height] duration-200 empty:hidden max-sm:text-sm',
        isInvalid ? 'h-0 border-transparent text-transparent' : 'h-[282px]',
      )}
    >
      <div className="flex items-center justify-between">
        <span>Price impact:</span>
        {isLoading ? (
          <div className="h-[18px] w-32 animate-pulse rounded-lg bg-light sm:h-[24px]" />
        ) : (
          <PriceImpact priceImpact={priceImpact} />
        )}
      </div>
      <div className="flex items-center justify-between">
        <span>
          {trade?.tradeType === TradeType.EXACT_OUTPUT
            ? 'Maximum sent'
            : 'Minimum received'}
        </span>
        {isLoading ? (
          <div className="h-[18px] w-28 animate-pulse rounded-lg bg-light sm:h-[24px]" />
        ) : (
          <span>
            {`${
              trade && trade.tradeType === TradeType.EXACT_INPUT
                ? trade.minimumAmountOut(allowedSlippage).toSignificant(6)
                : trade && trade.tradeType === TradeType.EXACT_OUTPUT
                  ? trade?.maximumAmountIn(allowedSlippage).toSignificant(6)
                  : ''
            } ${trade?.outputAmount.jetton.symbol || ''}`}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span>Slippage tolerance:</span>
        {isLoading ? (
          <div className="h-[18px] w-16 animate-pulse rounded-lg bg-light sm:h-[24px]" />
        ) : (
          <span>{allowedSlippage.toFixed(2)} %</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span>LP fee:</span>
        {isLoading ? (
          <div className="h-[18px] w-40 animate-pulse rounded-lg bg-light sm:h-[24px]" />
        ) : (
          <span>
            {adaptiveFee}% / {LPFeeString}
          </span>
        )}
      </div>
      <BlockchainFeeMenu
        txFeeState={transactionFee}
        tonDeltaAmount={tonDeltaSwapAmount}
        txType="swap"
      />
    </div>
  );
}

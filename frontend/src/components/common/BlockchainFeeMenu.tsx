import { fromNano } from '@ton/core';
import { ChevronDown, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { jettons } from 'src/constants/jettons';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { useJettonBalance } from 'src/hooks/jetton/useJettonBalance';
import { useJettonPriceUSD } from 'src/hooks/jetton/useJettonPriceUSD';
import { cn } from 'src/lib/cn';
import {
  TransactionFeeState,
  TransactionFeeStatus,
} from 'src/types/transaction-fee-state';
import { formatAmount } from 'src/utils/common/formatAmount';

export function BlockchainFeeMenu({
  txFeeState,
  tonDeltaAmount,
  txType,
}: {
  txFeeState: TransactionFeeState;
  tonDeltaAmount: number;
  txType: 'swap' | 'mint' | 'burn' | 'collect';
}) {
  const [isFeesExpanded, setIsFeesExpanded] = useState<boolean>(false);

  const { connected, wallet } = useTonConnect();

  const tonPriceUSD = useJettonPriceUSD(jettons.TON);
  const tonBalance = useJettonBalance(jettons.TON.address, wallet);

  const forwardGas = Number(txFeeState.gasForward);

  const totalGasLimit = txFeeState.gasLimit
    ? formatAmount(+txFeeState.gasLimit, 6)
    : txFeeState.gasLimit
      ? formatAmount(Number(txFeeState.gasLimit), 6)
      : '0';

  const balanceAfterTx = tonBalance
    ? Math.max(
        Number(fromNano(tonBalance)) -
          Number(txFeeState.fee) +
          Number(tonDeltaAmount),
        0,
      )
    : 0;

  useEffect(() => {
    setIsFeesExpanded(false);
  }, [txFeeState]);

  return (
    <div
      className={cn(
        'group flex flex-col gap-2 overflow-hidden border-b border-t border-lighter/60 py-2 transition-all duration-200 hover:border-lighter',
        isFeesExpanded
          ? 'max-h-[132px] sm:max-h-[138px]'
          : 'max-h-[40px] sm:max-h-[42px]',
      )}
    >
      <div
        role={'button'}
        tabIndex={0}
        onClick={() =>
          txFeeState.status !== TransactionFeeStatus.LOADING &&
          setIsFeesExpanded(!isFeesExpanded)
        }
        onKeyDown={() =>
          txFeeState.status !== TransactionFeeStatus.LOADING &&
          setIsFeesExpanded(!isFeesExpanded)
        }
        className="flex cursor-pointer items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Zap size={16} className="fill-[#1AC9FF] text-[#1AC9FF]" />
          Blockchain fee:
        </span>
        {connected && txFeeState ? (
          txFeeState.status === TransactionFeeStatus.LOADING ? (
            <div className="h-[18px] w-32 animate-pulse rounded-lg bg-lighter sm:h-[24px]" />
          ) : (
            <div className="flex items-center gap-1">
              {formatAmount(txFeeState.fee || 0, 6)} TON
              <span className="opacity-50">
                (${formatAmount(tonPriceUSD * Number(txFeeState.fee), 2)})
              </span>
              <ChevronDown
                className={cn(
                  'opacity-80 duration-300 group-hover:opacity-100',
                  isFeesExpanded ? 'rotate-180' : '',
                )}
                size={20}
              />
            </div>
          )
        ) : (
          <div className="flex items-center gap-1">
            {txFeeState.fee} TON
            <span className="opacity-50">
              (${formatAmount(tonPriceUSD * +(txFeeState.fee || 0), 2)})
            </span>
            <ChevronDown
              className={cn('duration-300', isFeesExpanded ? 'rotate-180' : '')}
              size={20}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="opacity-50">Forward gas:</span>
        <span>{forwardGas} TON</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="opacity-50">Total gas limit:</span>
        <div className="flex gap-1">
          {totalGasLimit} TON
          <span className="opacity-50">
            (${formatAmount(tonPriceUSD * Number(totalGasLimit), 2)})
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="opacity-50">Balance after {txType}:</span>
        <div className="flex gap-1">
          ≈ {balanceAfterTx.toFixed(6)} TON
          <span className="opacity-50">
            (${formatAmount(tonPriceUSD * Number(balanceAfterTx), 2)})
          </span>
        </div>
      </div>
    </div>
  );
}

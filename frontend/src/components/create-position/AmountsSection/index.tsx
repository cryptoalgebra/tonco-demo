import { Jetton, PoolMessageManager } from '@toncodex/sdk';
import { IDerivedMintInfo } from 'src/state/mintStore';
import { ActionButton } from 'src/components/ui/Button';
import { useMintCallback } from 'src/hooks/position/useMintCallback';
import { Spinner } from 'src/components/ui/Spinner';
import { useState } from 'react';
import { jettons } from 'src/constants/jettons';
import useMintSlippageTolerance from 'src/hooks/position/useMintSlippageTolerance';
import { cn } from 'src/lib/cn';
import {
  TransactionFeeState,
  TransactionFeeStatus,
} from 'src/types/transaction-fee-state';
import { fromNano } from '@ton/core';
import { BlockchainFeeMenu } from 'src/components/common/BlockchainFeeMenu';
import EnterAmounts from '../EnterAmounts';

interface AmountsSectionProps {
  currencyA: Jetton | undefined;
  currencyB: Jetton | undefined;
  mintInfo: IDerivedMintInfo;
}

function AmountsSection({
  currencyA,
  currencyB,
  mintInfo,
}: AmountsSectionProps) {
  const [txFeeState, setTxFeeState] = useState<TransactionFeeState>({
    status: TransactionFeeStatus.NONE,
    fee: fromNano(PoolMessageManager.gasUsage.MINT_GAS),
    gasForward: fromNano(PoolMessageManager.gasUsage.TRANSFER_GAS * 4n),
    gasLimit: fromNano(
      PoolMessageManager.gasUsage.MINT_GAS +
        PoolMessageManager.gasUsage.TRANSFER_GAS * 2n,
    ),
  });

  const tonDeltaMintAmount = mintInfo.position?.amount0.jetton.equals(
    jettons.TON,
  )
    ? Number(`-${mintInfo.position?.amount0.toSignificant(12)}`)
    : mintInfo.position?.amount1.jetton.equals(jettons.TON)
      ? Number(`-${mintInfo.position?.amount1.toSignificant(12)}`)
      : 0;

  const slippageTolerance = useMintSlippageTolerance(mintInfo.outOfRange);

  const { callback, isLoading } = useMintCallback(
    mintInfo,
    setTxFeeState,
    slippageTolerance,
  );

  return (
    <div className="flex w-full flex-col gap-4 sm:w-[450px]">
      <EnterAmounts
        currencyA={currencyA}
        currencyB={currencyB}
        mintInfo={mintInfo}
        slippage={slippageTolerance}
      />
      <ActionButton
        disabled={Boolean(isLoading || mintInfo.errorMessage)}
        onClick={callback}
      >
        {isLoading ? (
          <Spinner />
        ) : mintInfo.errorMessage ? (
          mintInfo.errorMessage
        ) : (
          'Create Position'
        )}
      </ActionButton>
      <div
        className={cn(
          'flex w-full flex-col gap-2 overflow-hidden px-1 transition-[height] duration-200 empty:hidden max-sm:text-sm',
          mintInfo.errorMessage
            ? 'h-0 border-transparent text-transparent'
            : 'h-[282px]',
        )}
      >
        <div className="flex items-center justify-between">
          <span>Slippage tolerance:</span>
          <span>{slippageTolerance.toFixed(2)}%</span>
        </div>
        <BlockchainFeeMenu
          txFeeState={txFeeState}
          tonDeltaAmount={tonDeltaMintAmount}
          txType="mint"
        />
      </div>
    </div>
  );
}

export default AmountsSection;

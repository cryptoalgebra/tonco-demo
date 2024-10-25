import { fromNano } from '@ton/core';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { BlockchainFeeMenu } from 'src/components/common/BlockchainFeeMenu';
import { JettonLogo } from 'src/components/common/JettonLogo';
import TokenRatio from 'src/components/create-position/TokenRatio';
import { ActionButton } from 'src/components/ui/Button';
import { Spinner } from 'src/components/ui/Spinner';
import { jettons } from 'src/constants/jettons';
import { useUSDValue } from 'src/hooks/jetton/useUSDValue';
import { ExtendedPosition } from 'src/hooks/position/useAllPositions';
import { useCollectCallback } from 'src/hooks/position/useCollectCallback';
import { PoolMessageManager } from '@toncodex/sdk';
import { IDerivedBurnInfo } from 'src/state/burnStore';
import {
  TransactionFeeState,
  TransactionFeeStatus,
} from 'src/types/transaction-fee-state';
import { formatAmount } from 'src/utils/common/formatAmount';

export function CollectFees({
  position,
  burnInfo,
}: {
  position: ExtendedPosition;
  burnInfo: IDerivedBurnInfo;
}) {
  const [txFeeState, setTxFeeState] = useState<TransactionFeeState>({
    status: TransactionFeeStatus.NONE,
    fee: fromNano(PoolMessageManager.gasUsage.BURN_GAS),
    gasForward: '0',
    gasLimit: fromNano(PoolMessageManager.gasUsage.BURN_GAS),
  });

  const jetton0 = position.position.pool.jetton0;
  const jetton1 = position.position.pool.jetton1;
  const { feeValue0, feeValue1 } = burnInfo;

  const amount0USD = useUSDValue(
    Number(position.position.amount0?.toFixed()),
    jetton0,
  );
  const amount1USD = useUSDValue(
    Number(position.position.amount1?.toFixed()),
    jetton1,
  );

  const feeUSDValue0 = useUSDValue(Number(feeValue0?.toFixed()), jetton0);
  const feeUSDValue1 = useUSDValue(Number(feeValue1?.toFixed()), jetton1);

  const tonDeltaCollectAmount = feeValue0?.jetton.equals(jettons.TON)
    ? Number(feeValue0?.toSignificant(12))
    : feeValue1?.jetton.equals(jettons.TON)
      ? Number(feeValue1?.toSignificant(12))
      : 0;

  const { callback, isLoading } = useCollectCallback(
    position.tokenId,
    burnInfo,
    setTxFeeState,
  );

  return (
    <div className="col-span-1 row-span-1 flex h-full flex-col gap-4 sm:gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3>Deposit</h3>
          <div className="flex gap-1 text-sm opacity-100">
            <span className="opacity-60">Total:</span>$
            {formatAmount(amount0USD + amount1USD, 2)}
          </div>
        </div>
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="flex w-1/2 items-center gap-2 rounded-xl bg-lighter p-2">
              <JettonLogo jetton={jetton0} size={36} />
              <div className="flex flex-col">
                <p className="text-sm">
                  {formatAmount(position.position.amount0.toFixed(), 4)}{' '}
                  {jetton0.symbol}
                </p>
                <p className="text-sm opacity-50">
                  ${formatAmount(amount0USD.toString(), 2)}
                </p>
              </div>
            </div>
            <Plus />
            <div className="flex w-1/2 items-center gap-2 rounded-xl bg-lighter p-2">
              <JettonLogo jetton={jetton1} size={36} />
              <div className="flex flex-col">
                <p className="text-sm">
                  {formatAmount(position.position.amount1.toFixed(), 4)}{' '}
                  {jetton1.symbol}
                </p>
                <p className="text-sm opacity-50">
                  ${formatAmount(amount1USD.toString(), 2)}
                </p>
              </div>
            </div>
          </div>
          <TokenRatio
            tokenA={jetton0}
            tokenB={jetton1}
            price={position.position.pool.jetton0Price}
            lowerPrice={position.position.token0PriceLower}
            upperPrice={position.position.token0PriceUpper}
            tickSpacing={position.position.pool.tickSpacing}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3>Earned</h3>
        <div className="flex flex-col gap-2 text-[15px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <JettonLogo jetton={jetton0} size={24} />
              <span>{jetton0.symbol} Fee Earned</span>
            </div>
            <div className="flex gap-1">
              {formatAmount(feeValue0?.toFixed() || '0', 6)}
              {feeUSDValue0 > 0 ? (
                <span className="self-center text-sm opacity-50">
                  (${formatAmount(feeUSDValue0, 2)})
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <JettonLogo jetton={jetton1} size={24} />
              <span>{jetton1.symbol} Fee Earned</span>
            </div>
            <div className="flex gap-1">
              {formatAmount(feeValue1?.toFixed() || '0', 6)}
              {feeUSDValue1 > 0 ? (
                <span className="self-center text-sm opacity-50">
                  (${formatAmount(feeUSDValue1, 2)})
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {feeValue0?.equalTo(0) && feeValue1?.equalTo(0) ? null : (
          <div className="text-[15px]">
            <BlockchainFeeMenu
              txFeeState={txFeeState}
              tonDeltaAmount={tonDeltaCollectAmount}
              txType="collect"
            />
          </div>
        )}

        <ActionButton
          color="blue"
          onClick={callback}
          disabled={
            isLoading || (feeValue0?.equalTo(0) && feeValue1?.equalTo(0))
          }
        >
          {isLoading ? <Spinner /> : 'Collect fees'}
        </ActionButton>
      </div>
    </div>
  );
}

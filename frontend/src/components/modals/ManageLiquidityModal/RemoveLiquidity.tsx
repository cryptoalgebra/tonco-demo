import { fromNano } from '@ton/core';
import { useState } from 'react';
import ReactSlider from 'react-slider';
import { BlockchainFeeMenu } from 'src/components/common/BlockchainFeeMenu';
import { JettonLogo } from 'src/components/common/JettonLogo';
import { ActionButton, Button } from 'src/components/ui/Button';
import { Input } from 'src/components/ui/Input';
import { Spinner } from 'src/components/ui/Spinner';
import { jettons } from 'src/constants/jettons';
import { useDebounce } from 'src/hooks/common/useDebounce';
import { useUSDValue } from 'src/hooks/jetton/useUSDValue';
import { ExtendedPosition } from 'src/hooks/position/useAllPositions';
import { useBurnCallback } from 'src/hooks/position/useBurnCallback';
import { PoolMessageManager } from '@toncodex/sdk';
import {
  IDerivedBurnInfo,
  useBurnActionHandlers,
  useBurnState,
} from 'src/state/burnStore';
import {
  TransactionFeeState,
  TransactionFeeStatus,
} from 'src/types/transaction-fee-state';
import { formatAmount } from 'src/utils/common/formatAmount';

export function RemoveLiquidity({
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
  const { percent } = useBurnState();
  const { onPercentSelect } = useBurnActionHandlers();
  const jetton0 = position.position.pool.jetton0;
  const jetton1 = position.position.pool.jetton1;

  const amount0 = burnInfo.liquidityValue0?.toFixed();
  const amount1 = burnInfo.liquidityValue1?.toFixed();
  const amount0USD = useUSDValue(Number(useDebounce(amount0, 500)), jetton0);
  const amount1USD = useUSDValue(Number(useDebounce(amount1, 500)), jetton1);

  const feeAmount0 = burnInfo.feeValue0?.toFixed();
  const feeAmount1 = burnInfo.feeValue1?.toFixed();
  const feeUSDValue0 = useUSDValue(
    Number(useDebounce(feeAmount0, 500)),
    jetton0,
  );
  const feeUSDValue1 = useUSDValue(
    Number(useDebounce(feeAmount1, 500)),
    jetton1,
  );

  const tonDeltaBurnAmount = burnInfo.liquidityValue0?.jetton.equals(
    jettons.TON,
  )
    ? Number(burnInfo.liquidityValue0?.toSignificant(12)) + Number(feeAmount0)
    : burnInfo.liquidityValue1?.jetton.equals(jettons.TON)
      ? Number(burnInfo.liquidityValue1?.toSignificant(12)) + Number(feeAmount1)
      : 0;

  const { callback: burnCallback, isLoading } = useBurnCallback(
    position.tokenId,
    burnInfo,
    setTxFeeState,
  );

  return (
    <div className="col-span-1 row-span-1 mt-auto flex flex-col gap-4">
      <h3>Select a percent</h3>
      <div className="flex h-fit w-full flex-col gap-4 rounded-xl border border-lighter p-2 py-3">
        <div className="flex w-full items-center justify-between">
          <ul className="flex gap-2">
            {[25, 50, 75, 100].map((percentStep) => (
              <li key={percentStep}>
                <Button
                  onClick={() => onPercentSelect(percentStep)}
                  className="h-10 rounded-xl px-3"
                  variant={
                    percentStep === percent ? 'outlineActive' : 'outline'
                  }
                >
                  {percentStep === 100 ? 'Max' : `${percentStep}%`}
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex items-center text-xl sm:text-2xl">
            <Input
              onUserInput={(val) => {
                const num = Number(val);
                if (num >= 0 && num <= 100) onPercentSelect(Number(val));
              }}
              value={percent}
              className="w-14 bg-transparent text-center outline-none sm:w-16"
            />
            %
          </div>
        </div>

        <ReactSlider
          className="relative mb-4 h-3 w-full"
          thumbClassName="flex items-center relative justify-center w-6 h-6 bg-primary-green text-white rounded-full cursor-grab border-2 border-white"
          trackClassName="absolute top-1/2 h-3 bg-border-light rounded-xl"
          value={percent}
          onChange={onPercentSelect}
          min={0}
          max={100}
          step={1}
          renderTrack={(props, state) => {
            const trackClassName =
              state.index === 0
                ? 'absolute top-1/2 h-3 bg-primary-green rounded-xl'
                : 'absolute top-1/2 h-3 bg-border-light rounded-xl';
            return (
              <div {...props} className={trackClassName} key={state.index} />
            );
          }}
        />
      </div>
      <h3>{"You'll receive"}</h3>
      <div className="flex flex-col gap-2 text-[15px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <JettonLogo jetton={jetton0} size={24} />
            <span>Pooled {jetton0.symbol}</span>
          </div>
          <div className="flex gap-1">
            {formatAmount(amount0 || '0', 6)}
            {amount0USD > 0 ? (
              <span className="self-center text-sm opacity-50">
                (${formatAmount(amount0USD || '0', 2)})
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <JettonLogo jetton={jetton1} size={24} />
            <span>Pooled {jetton1.symbol}</span>
          </div>
          <div className="flex gap-1">
            <span>{formatAmount(amount1 || '0', 6)}</span>
            {amount1USD > 0 ? (
              <span className="self-center text-sm opacity-50">
                (${formatAmount(amount1USD || '0', 2)})
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <JettonLogo jetton={jetton0} size={24} />
            <span>{jetton0.symbol} Fee Earned</span>
          </div>
          <div className="flex gap-1">
            <span>{formatAmount(feeAmount0 || '0', 6)}</span>
            {feeUSDValue0 > 0 ? (
              <span className="self-center text-sm opacity-50">
                (${formatAmount(feeUSDValue0 || '0', 2)})
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
            <span>{formatAmount(feeAmount1 || '0', 6)}</span>
            {feeUSDValue1 > 0 ? (
              <span className="self-center text-sm opacity-50">
                (${formatAmount(feeUSDValue1 || '0', 2)})
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {burnInfo.liquidityValue0?.equalTo('0') &&
      burnInfo.liquidityValue1?.equalTo('0') ? null : (
        <div className="text-[15px]">
          <BlockchainFeeMenu
            txFeeState={txFeeState}
            tonDeltaAmount={tonDeltaBurnAmount}
            txType="burn"
          />
        </div>
      )}

      <ActionButton
        color="red"
        disabled={Boolean(
          burnInfo.error ||
            isLoading ||
            (burnInfo.liquidityValue0?.equalTo('0') &&
              burnInfo.liquidityValue1?.equalTo('0')),
        )}
        onClick={burnCallback}
      >
        {burnInfo.error ? (
          burnInfo.error
        ) : isLoading ? (
          <Spinner />
        ) : (
          'Remove Liquidity'
        )}
      </ActionButton>
    </div>
  );
}

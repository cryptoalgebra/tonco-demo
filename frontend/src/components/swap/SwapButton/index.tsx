import { useTonConnectModal } from '@tonconnect/ui-react';
import { ActionButton } from 'src/components/ui/Button';
import { Spinner } from 'src/components/ui/Spinner';
import { APP_CHAIN } from 'src/constants/chain';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { usePoolV3 } from 'src/hooks/pool/usePoolV3';
import { useSwapCallback } from 'src/hooks/swap/useSwapCallback';
import { IDerivedSwapInfo } from 'src/state/swapStore';
import { TradeState } from 'src/types/trade-state';

export function SwapButton({ swapInfo }: { swapInfo: IDerivedSwapInfo }) {
  const { connected, network } = useTonConnect();
  const { open } = useTonConnectModal();

  const {
    inputError: swapInputError,
    toggledTrade: trade,
    poolAddress,
    tradeState,
    allowedSlippage,
  } = swapInfo;

  const [, pool] = usePoolV3(poolAddress);

  const { callback: swapCallback, isLoading: isTxLoading } = useSwapCallback({
    trade,
    allowedSlippage,
    pool,
  });

  const isValid = !swapInputError;

  const isWrongChain = network !== APP_CHAIN;

  if (!connected)
    return <ActionButton onClick={open}>Connect wallet</ActionButton>;

  if (tradeState.state === TradeState.LOADING || isTxLoading)
    return (
      <ActionButton disabled>
        <Spinner />
      </ActionButton>
    );

  if (!isValid) return <ActionButton disabled>{swapInputError}</ActionButton>;

  if (isWrongChain) return <ActionButton disabled>Wrong network</ActionButton>;

  if (!connected)
    return <ActionButton onClick={open}>Connect wallet</ActionButton>;

  return (
    <ActionButton
      onClick={swapCallback}
      disabled={!swapCallback || !isValid || isTxLoading}
    >
      {swapInputError || 'Swap'}
    </ActionButton>
  );
}

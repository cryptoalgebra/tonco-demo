import TokenSelectMenu from 'src/components/swap/TokenSelectMenu';
import { SwapButton } from 'src/components/swap/SwapButton';
import SwapPair from 'src/components/swap/SwapPair';
import { UpdateButton } from 'src/components/ui/Button/UpdateButton';
import { cn } from 'src/lib/cn';
import { useTokenMenuState } from 'src/state/tokenMenuStore';
import { MenuState } from 'src/types/token-menu';
import SwapSettings from 'src/components/swap/SwapSettings';
import { SwapParams } from 'src/components/swap/SwapParams';
import { useDerivedSwapInfo } from 'src/state/swapStore';
import { usePoolData } from 'src/hooks/pool/usePoolV3';

export function SwapPage() {
  const { menuState } = useTokenMenuState();
  const swapInfo = useDerivedSwapInfo();

  const { mutate } = usePoolData(swapInfo.poolAddress);

  return (
    <div className="animate-fade-in py-6 max-md:pb-16 sm:py-20">
      <section className="mx-auto sm:w-[500px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl">Swap</h2>
          <div className="flex gap-4">
            <UpdateButton
              onFocus={() => mutate()}
              className="focus:animate-rotate-in"
            />
            <SwapSettings />
          </div>
        </div>
        <div
          style={{
            background:
              'linear-gradient(to bottom, #1A1A1A 0%, #1A1A1A 75%, #292929 100%',
          }}
          className={cn(
            'relative flex w-full flex-col overflow-hidden rounded-xl bg-light transition-all duration-300',
            menuState === MenuState.CLOSED
              ? 'h-[364px]'
              : 'h-[502px] sm:h-[602px]',
          )}
        >
          <div
            className={cn(
              'flex flex-col gap-4',
              menuState === MenuState.CLOSED ? '' : 'hidden',
            )}
          >
            <SwapPair swapInfo={swapInfo} />
            <SwapButton swapInfo={swapInfo} />
          </div>
          <div className="rounded-xl border border-border-light empty:border-0">
            {menuState !== MenuState.CLOSED && <TokenSelectMenu />}
          </div>
        </div>
        <SwapParams swapInfo={swapInfo} />
      </section>
    </div>
  );
}

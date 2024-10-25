import { JettonLogo } from 'src/components/common/JettonLogo';
import { ExtendedPosition } from 'src/hooks/position/useAllPositions';
import nftStub from 'src/assets/nftStub.webp';
import { ManageLiquidityModal } from 'src/components/modals/ManageLiquidityModal';
import { useMemo, useState } from 'react';
import TokenRatio from 'src/components/create-position/TokenRatio';
import { useDerivedMintInfo } from 'src/state/mintStore';
import { cn } from 'src/lib/cn';
import { Button } from 'src/components/ui/Button';
import { formatAmount } from 'src/utils/common/formatAmount';
import { computePoolAddress } from '@toncodex/sdk';
import { Address } from '@ton/core';

export function PositionCard({ position }: { position: ExtendedPosition }) {
  const [isOpen, setIsOpen] = useState(false);
  const pool = position.position.pool;

  const jetton0 = pool.jetton0;
  const jetton1 = pool.jetton1;
  const amount0 = position.position.amount0;
  const amount1 = position.position.amount1;
  const lowPrice = position.position.token0PriceLower?.toFixed();
  const highPrice = position.position.token0PriceUpper?.toFixed();

  const poolAddress = useMemo(() => {
    if (!pool?.jetton0_wallet || !pool?.jetton1_wallet) return undefined;

    return computePoolAddress(
      Address.parse(pool.jetton0_wallet),
      Address.parse(pool.jetton1_wallet),
    );
  }, [pool]);

  const mintInfo = useDerivedMintInfo(
    position.position.pool.jetton0,
    position.position.pool.jetton1,
    poolAddress?.toString(),
    position.position.pool.fee,
    position.position.pool.jetton0,
    position.position,
  );

  const outOfRange = mintInfo.outOfRange;
  const isClosed = position.position.liquidity.toString() === '0';

  return (
    <ManageLiquidityModal
      mintInfo={mintInfo}
      position={position}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div
        role={'button'}
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={() => setIsOpen(true)}
        className="group flex h-fit w-full cursor-pointer flex-col gap-2 rounded-2xl bg-light"
      >
        <div className="relative flex h-[180px] w-full flex-col items-center justify-center overflow-clip rounded-2xl bg-border-light/50 p-4">
          <img
            className="absolute inset-0 bg-white/70 transition-all duration-300 group-hover:scale-105"
            src={position.nftImage || nftStub}
            alt={'Position NFT'}
          />
          <div className="text-md absolute left-2 top-2 flex h-fit w-fit items-center justify-center rounded-full bg-white px-2 py-1 text-black">
            #{position?.tokenId}
          </div>
          <div className="z-10 flex h-fit w-full flex-col items-center justify-center rounded-xl bg-black bg-opacity-70 py-2">
            <p>
              {formatAmount(lowPrice, 4)} - {formatAmount(highPrice, 4)}
            </p>
          </div>
          {isClosed ? null : (
            <div className="absolute bottom-2 w-full px-2 text-sm">
              <TokenRatio
                tokenA={jetton0}
                tokenB={jetton1}
                price={mintInfo.price}
                lowerPrice={mintInfo.lowerPrice}
                upperPrice={mintInfo.upperPrice}
                tickSpacing={position.position.pool.tickSpacing}
              />
            </div>
          )}
          <div
            className={cn(
              'absolute right-2 top-2 flex h-fit w-fit items-center justify-center rounded-full px-2 py-1 text-sm',
              isClosed
                ? 'bg-black'
                : outOfRange
                  ? 'bg-yellow-600'
                  : 'bg-green-600',
            )}
          >
            {isClosed ? 'Closed' : outOfRange ? 'Out of range' : 'In range'}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 px-2 text-opacity-50">
          {/* <p className="text-sm mr-auto opacity-50">Amounts</p> */}
          <div className="flex w-full items-center gap-2 text-sm">
            <JettonLogo jetton={jetton0} size={22} />
            {jetton0.symbol}
            <p className="ml-auto">{formatAmount(amount0.toFixed(), 4)}</p>
          </div>
          <div className="flex w-full items-center gap-2 text-sm">
            <JettonLogo jetton={jetton1} size={22} />
            {jetton1.symbol}
            <p className="ml-auto">{formatAmount(amount1.toFixed(), 4)}</p>
          </div>
        </div>
        {/* <Button
                onClick={() => null}
                variant={"outline"}
                className="rounded-xl mx-2  border-blue-500/80 hover:bg-blue-500/20 hover:border-blue-500"
            >
                Collect fees
            </Button> */}
        <Button
          onClick={() => setIsOpen(true)}
          variant={'outline'}
          className="m-2 mt-0 rounded-xl"
        >
          Manage
        </Button>
      </div>
    </ManageLiquidityModal>
  );
}

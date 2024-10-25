import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/Dialog';
import { useMemo, useState } from 'react';
import { ExtendedPosition } from 'src/hooks/position/useAllPositions';
import { ManageLiquidity } from 'src/types/manage-liquidity';
import { IDerivedMintInfo } from 'src/state/mintStore';
import LiquidityChartRangeInput from 'src/components/common/LiquidityChartRangeInput';
import { formatAmount } from 'src/utils/common/formatAmount';
import { useDerivedBurnInfo } from 'src/state/burnStore';
import { PriceToggle } from 'src/components/common/PriceToggle';
import { ActionSelect } from './ActionSelect';
import { PositionHeader } from './PositionHeader';
import { CollectFees } from './CollectFees';
import { RemoveLiquidity } from './RemoveLiquidity';

export function ManageLiquidityModal({
  position,
  isOpen,
  setIsOpen,
  mintInfo,
  children,
}: {
  position: ExtendedPosition;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mintInfo: IDerivedMintInfo;
  children?: React.ReactNode;
}) {
  const [isSorted, setIsSorted] = useState(true);

  const [manageLiquidity, setManageLiquidity] = useState<ManageLiquidity>(
    ManageLiquidity.COLLECT,
  );

  /* todo: get from props */
  const burnInfo = useDerivedBurnInfo(position);

  const jetton0 = position.position.pool.jetton0;
  const jetton1 = position.position.pool.jetton1;

  const { price, minPrice, maxPrice } = useMemo(() => {
    if (!mintInfo.price) return {};
    const priceLower = position.position.token0PriceLower;
    const priceUpper = position.position.token0PriceUpper;

    return isSorted
      ? {
          price: mintInfo.price.toSignificant(5),
          minPrice: priceLower.toSignificant(5),
          maxPrice: priceUpper.toSignificant(5),
        }
      : {
          price: mintInfo.price.invert().toSignificant(5),
          minPrice: priceUpper.invert().toSignificant(5),
          maxPrice: priceLower.invert().toSignificant(5),
        };
  }, [mintInfo, isSorted, position]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={Boolean(children)}>{children}</DialogTrigger>
      <DialogContent className="max-h-[90%] animate-fade-in overflow-y-auto rounded-2xl border-border-light bg-light md:min-w-[900px]">
        <DialogHeader className="mb-4 flex h-fit flex-col gap-4 max-sm:mt-1 md:mr-6">
          <DialogTitle className="flex w-full text-3xl">
            Manage Liquidity
          </DialogTitle>
          <ActionSelect
            manageLiquidity={manageLiquidity}
            setManageLiquidity={setManageLiquidity}
          />
        </DialogHeader>
        <div className="grid h-fit grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <PositionHeader
            jetton0={jetton0}
            jetton1={jetton1}
            tokenId={position.tokenId}
            fee={position.position.pool.fee}
            outOfRange={mintInfo.outOfRange}
            isClosed={position.position.liquidity.toString() === '0'}
          />
          <div className="col-span-1 row-span-2 flex h-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3>Selected Range</h3>
              <PriceToggle
                isSorted={isSorted}
                setIsSorted={setIsSorted}
                jetton0={jetton0}
                jetton1={jetton1}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex w-1/2 flex-col items-center justify-center rounded-2xl border border-border-light py-4">
                <p className="text-sm opacity-50">Min Price</p>
                <p>{formatAmount(minPrice || 0, 6)}</p>
                <p className="text-sm opacity-80">
                  {isSorted
                    ? `${jetton1.symbol} per ${jetton0.symbol}`
                    : `${jetton0.symbol} per ${jetton1.symbol}`}
                </p>
              </div>
              <div className="flex w-1/2 flex-col items-center justify-center rounded-2xl border border-border-light py-4">
                <p className="text-sm opacity-50">Max Price</p>
                <p>{formatAmount(maxPrice || 0, 6)}</p>
                <p className="text-sm opacity-80">
                  {isSorted
                    ? `${jetton1.symbol} per ${jetton0.symbol}`
                    : `${jetton0.symbol} per ${jetton1.symbol}`}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Current Price:</p>
              <p className="text-sm opacity-80">{`${price} ${isSorted ? jetton1.symbol : jetton0.symbol} per ${
                isSorted ? jetton0.symbol : jetton1.symbol
              }`}</p>
            </div>
            <div className="mt-auto">
              <LiquidityChartRangeInput
                // currencyA={jetton0}
                // currencyB={jetton1}
                pool={position.position.pool}
                priceLower={position.position.token0PriceLower}
                priceUpper={position.position.token0PriceUpper}
                ticksAtLimit={mintInfo.ticksAtLimit}
                price={price ? parseFloat(price) : undefined}
                onLeftRangeInput={() => null}
                onRightRangeInput={() => null}
                variant={'dark'}
                interactive={false}
                isOnlyView={false}
                isSorted={isSorted}
              />
            </div>
          </div>

          {manageLiquidity === ManageLiquidity.COLLECT && (
            <CollectFees position={position} burnInfo={burnInfo} />
          )}
          {manageLiquidity === ManageLiquidity.REMOVE && (
            <RemoveLiquidity position={position} burnInfo={burnInfo} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

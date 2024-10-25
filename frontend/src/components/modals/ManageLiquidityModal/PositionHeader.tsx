import { Circle } from 'lucide-react';
import { JettonLogo } from 'src/components/common/JettonLogo';
import { Jetton } from '@toncodex/sdk';

export function PositionHeader({
  jetton0,
  jetton1,
  tokenId,
  fee,
  outOfRange,
  isClosed,
}: {
  jetton0: Jetton;
  jetton1: Jetton;
  tokenId: number;
  fee: number;
  outOfRange: boolean;
  isClosed: boolean;
}) {
  return (
    <div className="col-span-1 row-span-1 mb-auto flex h-fit flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex justify-center">
          <JettonLogo size={36} jetton={jetton0} />
          <JettonLogo size={36} className="-ml-2" jetton={jetton1} />
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-xl">
            {jetton0.symbol} / {jetton1.symbol}
          </h3>
          <p className="text-sm opacity-50">
            #{tokenId} / {fee / 100}% Fee
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-2xl border border-lighter px-2 py-1 text-sm">
          {isClosed ? (
            <>
              <Circle size={12} className="fill-black text-white" />
              Closed
            </>
          ) : outOfRange ? (
            <>
              <Circle size={12} className="fill-red-500 text-red-500" /> Out of
              Range
            </>
          ) : (
            <>
              <Circle size={12} className="fill-green-500 text-green-500" />
              In range
            </>
          )}
        </div>
      </div>
    </div>
  );
}

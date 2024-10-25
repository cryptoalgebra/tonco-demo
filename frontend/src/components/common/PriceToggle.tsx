import { Jetton } from '@toncodex/sdk';
import { Button } from '../ui/Button';

export function PriceToggle({
  isSorted,
  setIsSorted,
  jetton0,
  jetton1,
}: {
  isSorted: boolean;
  setIsSorted: (isSorted: boolean) => void;
  jetton0: Jetton | undefined;
  jetton1: Jetton | undefined;
}) {
  return (
    <div className="flex h-fit w-fit gap-0.5 rounded-xl border border-lighter p-0.5">
      <Button
        className="h-4 rounded-lg text-xs font-normal max-sm:p-3.5"
        variant={isSorted ? 'iconActive' : 'icon'}
        onClick={() => setIsSorted(true)}
      >
        {jetton0?.symbol}
      </Button>
      <Button
        className="h-4 rounded-lg text-xs font-normal max-sm:p-3.5"
        variant={!isSorted ? 'iconActive' : 'icon'}
        onClick={() => setIsSorted(false)}
      >
        {jetton1?.symbol}
      </Button>
    </div>
  );
}

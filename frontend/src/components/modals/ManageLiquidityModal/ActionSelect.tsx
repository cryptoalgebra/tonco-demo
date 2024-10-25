import { Button } from 'src/components/ui/Button';
import { ManageLiquidity } from 'src/types/manage-liquidity';

export function ActionSelect({
  manageLiquidity,
  setManageLiquidity,
}: {
  manageLiquidity: ManageLiquidity;
  setManageLiquidity: React.Dispatch<React.SetStateAction<ManageLiquidity>>;
}) {
  return (
    <div className="flex h-fit w-full items-center justify-between gap-0.5 rounded-xl border border-border-light p-0.5 md:w-1/2">
      <Button
        className="h-fit w-1/2 text-nowrap rounded-lg py-3"
        onClick={() => setManageLiquidity(ManageLiquidity.COLLECT)}
        variant={
          manageLiquidity === ManageLiquidity.COLLECT
            ? 'outlineActiveBlue'
            : 'ghost'
        }
      >
        Collect Fees
      </Button>
      <Button
        className="h-fit w-1/2 text-nowrap rounded-lg py-3"
        onClick={() => setManageLiquidity(ManageLiquidity.REMOVE)}
        variant={
          manageLiquidity === ManageLiquidity.REMOVE
            ? 'outlineActiveRed'
            : 'ghost'
        }
      >
        Remove Liquidity
      </Button>
    </div>
  );
}

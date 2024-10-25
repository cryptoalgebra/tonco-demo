import { Skeleton } from 'src/components/ui/Skeleton';

export function LoadingState() {
  return (
    <div className="flex w-full flex-col gap-4 sm:pb-4">
      <div className="flex gap-4">
        <Skeleton className="h-[50px] w-1/2 rounded-lg bg-lighter sm:w-[320px]" />
        <Skeleton className="h-[50px] w-1/2 rounded-lg bg-lighter sm:w-[156px]" />
      </div>
      <Skeleton className="h-[40px] w-full rounded-lg bg-lighter" />
      {[1, 2, 3, 4].map((v) => (
        <Skeleton
          key={`table-skeleton-${v}`}
          className="h-[120px] w-full rounded-lg bg-lighter sm:h-[80px]"
        />
      ))}
    </div>
  );
}

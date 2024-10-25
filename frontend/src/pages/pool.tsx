import { Address } from '@ton/core';
import JSBI from 'jsbi';
import { ArrowRight, ChevronDown, Info, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PoolDetails } from 'src/components/pool/PoolDetails';
import { PoolHeader } from 'src/components/pool/PoolHeader';
import { PositionList } from 'src/components/pool/PositionList';
import { UserStats } from 'src/components/pool/UserStats';
import { Button } from 'src/components/ui/Button';
import { Input } from 'src/components/ui/Input';
import { Skeleton } from 'src/components/ui/Skeleton';
import { useTonConnect } from 'src/hooks/common/useTonConnect';
import { usePoolData, usePoolV3 } from 'src/hooks/pool/usePoolV3';
import { useAllPositions } from 'src/hooks/position/useAllPositions';
import { cn } from 'src/lib/cn';

enum PositionFilter {
  ALL,
  ACTIVE,
  CLOSED,
}

function PoolPage() {
  const { poolId } = useParams();
  const { data: poolData } = usePoolData(poolId);
  const [, pool] = usePoolV3(poolId);
  const { wallet } = useTonConnect();

  const [searchValue, setSearchValue] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>(
    PositionFilter.ALL,
  );
  const { positions, isLoading } = useAllPositions({
    poolAddress: poolId,
    wallet,
    pool,
  });

  const filteredPositions = useMemo(
    () =>
      positions
        ?.filter((position) => {
          if (!searchValue) return true;
          try {
            if (Address.parse(searchValue)) {
              return Address.parse(searchValue).equals(
                Address.parse(position.nftAddress),
              );
            }
          } catch (error) {
            return position.tokenId.toString().includes(searchValue);
          }
          return false;
        })
        .filter((position) => {
          switch (positionFilter) {
            case PositionFilter.ALL:
              return true;
            case PositionFilter.ACTIVE:
              return JSBI.greaterThan(
                position.position.liquidity,
                JSBI.BigInt(0),
              );
            case PositionFilter.CLOSED:
              return JSBI.equal(position.position.liquidity, JSBI.BigInt(0));
            default:
              return true;
          }
        }),
    [searchValue, positions, positionFilter],
  );

  const jetton0 = pool?.jetton0;
  const jetton1 = pool?.jetton1;

  if (!jetton0 || !jetton1 || !pool || !poolId) {
    return (
      <div className="grid w-full animate-fade-in grid-cols-3 gap-4 py-6 sm:py-12 md:gap-6">
        <Skeleton className="order-0 col-span-3 mr-auto h-48 w-full rounded-2xl bg-border-light/50 md:h-32" />
        <Skeleton className="col-span-1 h-[465px] w-full rounded-2xl bg-border-light/50 max-md:order-1 max-md:col-span-3" />
        <Skeleton className="col-span-2 h-24 w-full rounded-2xl bg-border-light/50 max-md:col-span-3 md:h-12" />
      </div>
    );
  }

  return (
    <div className="flex w-full animate-fade-in flex-col gap-4 py-6 max-md:pb-24 sm:py-12 md:gap-6">
      <PoolHeader poolData={poolData} />
      <div className="flex w-full gap-4 max-md:flex-col md:gap-6">
        <div
          className={cn(
            'flex w-[600px] flex-col gap-6 max-md:w-full',
            !positions || !positions?.length ? 'max-md:hidden' : '',
          )}
        >
          {positions && positions.length > 0 ? (
            <UserStats positions={positions} />
          ) : null}
          <PoolDetails poolData={poolData} />
        </div>
        <div className="flex w-full flex-col gap-4 md:gap-6">
          <div className="grid h-fit w-full grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            <div className="relative flex h-fit min-h-12 w-full items-center lg:col-span-2">
              <Input
                value={searchValue}
                onChange={({ target }) => setSearchValue(target.value)}
                placeholder="Search by index or address"
                className="h-12 w-full rounded-xl bg-light pl-12 text-sm outline-none focus:border-opacity-100"
              />
              <Search className="text-border absolute left-4" size={20} />
            </div>
            <div className="relative">
              <select
                value={positionFilter}
                onChange={({ target }) =>
                  setPositionFilter(Number(target.value))
                }
                className="h-12 w-full appearance-none rounded-xl bg-light px-4 outline-none lg:col-span-1"
              >
                <option value={PositionFilter.ALL}>All</option>
                <option value={PositionFilter.ACTIVE}>Active</option>
                <option value={PositionFilter.CLOSED}>Closed</option>
              </select>
              <ChevronDown className="absolute right-4 top-4" size={16} />
            </div>

            <Link
              className="col-span-2 flex min-h-12 w-full gap-2 max-lg:-order-1 lg:col-span-1"
              to={`/pool/${poolId}/create-position`}
            >
              <Button className="h-12 w-full text-nowrap rounded-xl">
                Create new position{' '}
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="flex w-full gap-4 sm:gap-6">
              <div className="flex w-full flex-col">
                <Skeleton className="z-20 h-[200px] w-full rounded-xl bg-lighter" />
                <Skeleton className="z-10 h-[120px] w-full -translate-y-2 rounded-xl rounded-t-none bg-light" />
              </div>
              <div className="w-full flex-col sm:flex md:hidden lg:flex">
                <Skeleton className="z-20 h-[200px] w-full rounded-xl bg-lighter" />
                <Skeleton className="z-10 h-[120px] w-full -translate-y-2 rounded-xl rounded-t-none bg-light" />
              </div>
              <div className="flex w-full flex-col max-sm:hidden">
                <Skeleton className="z-20 h-[200px] w-full rounded-xl bg-lighter" />
                <Skeleton className="z-10 h-[120px] w-full -translate-y-2 rounded-xl rounded-t-none bg-light" />
              </div>
              <div className="flex w-full flex-col max-sm:hidden">
                <Skeleton className="z-20 h-[200px] w-full rounded-xl bg-lighter" />
                <Skeleton className="z-10 h-[120px] w-full -translate-y-2 rounded-xl rounded-t-none bg-light" />
              </div>
            </div>
          ) : filteredPositions?.length ? (
            <PositionList positions={filteredPositions} />
          ) : null}
          {!filteredPositions?.length && !isLoading && (
            <div className="w-full">
              <div className="flex flex-col items-center justify-center gap-4 p-4 text-xl sm:mt-16">
                <Info size={32} />
                <h3 className="text-2xl">No Position Found</h3>
                {positions?.length ? (
                  <>
                    <div className="text-sm opacity-60">
                      <p>No positions found for these filters</p>
                      <p>Try changing them or reset</p>
                    </div>
                    <Button
                      variant={'outline'}
                      className="rounded-xl"
                      onClick={() => {
                        setPositionFilter(PositionFilter.ALL);
                        setSearchValue('');
                      }}
                    >
                      Reset filters
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-sm opacity-60">
                      <p>{"You don't have positions for this pool"}</p>
                      <p>{"Let's create one!"}</p>
                    </div>
                    <Link
                      className="flex gap-2"
                      to={`/pool/${poolId}/create-position`}
                    >
                      <Button className="rounded-xl">
                        Create position <ArrowRight size={20} />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PoolPage;

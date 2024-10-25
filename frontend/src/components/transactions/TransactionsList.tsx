import { useMemo } from 'react';
import {
  useGetBurnsQuery,
  useGetCollectsQuery,
  useGetMintsQuery,
  useGetSwapsQuery,
} from 'src/graphql/generated/graphql';
import { isDefined } from 'src/utils/common/isDefined';
import TransactionsTable from '../common/Table/transactionsTable';
import { transactionsColumns, TX } from '../common/Table/transactionsColumns';

function TransactionsList({
  jettonId,
  poolId,
}: {
  jettonId?: string;
  poolId?: string;
}) {
  const { data: mints, loading: mintsLoading } = useGetMintsQuery();
  const { data: swaps, loading: swapsLoading } = useGetSwapsQuery();
  const { data: burns, loading: burnsLoading } = useGetBurnsQuery();
  const { data: collects, loading: collectsLoading } = useGetCollectsQuery();

  const sortedTxs: TX[] = useMemo(() => {
    const _mints = mints?.mints || [];
    const _swaps =
      swaps?.swaps?.map((swap) => ({
        ...swap,
        amount0: swap?.toRefund0 === '0' ? swap.amount : swap?.toRefund0,
        amount1: swap?.toRefund1 === '0' ? swap.amount : swap?.toRefund1,
      })) || [];
    const _burns = burns?.burns || [];
    const _collects = collects?.collects || [];

    return [..._mints, ..._swaps, ..._burns, ..._collects]
      .filter(isDefined)
      .filter((tx) => {
        if (jettonId) {
          return (
            tx.pool?.jetton0.address === jettonId ||
            tx.pool?.jetton1.address === jettonId
          );
        }
        if (poolId) {
          return tx.pool?.address === poolId;
        }
        return true;
      })
      .sort((a, b) => Number(a?.time) - Number(b?.time))
      .map((tx) => ({
        now: new Date(),
        time: tx.time,
        hash: tx.hash || '',
        pool: {
          address: tx.pool?.address || '',
          jetton0: {
            symbol: tx.pool?.jetton0.symbol || '',
            address: tx.pool?.jetton0.address || '',
            decimals: tx.pool?.jetton0.decimals || 0,
          },
          jetton1: {
            symbol: tx.pool?.jetton1.symbol || '',
            address: tx.pool?.jetton1.address || '',
            decimals: tx.pool?.jetton1.decimals || 0,
          },
        },
        amount0: Number(tx.amount0) || 0,
        amount1: Number(tx.amount1) || 0,
        wallet: tx.wallet || '',
        __typename: tx.__typename || '',
      }));
  }, [mints, swaps, burns, collects, jettonId, poolId]);

  const isLoading =
    mintsLoading || swapsLoading || burnsLoading || collectsLoading;

  return (
    <div className="flex w-full flex-col gap-4">
      <TransactionsTable
        columns={transactionsColumns}
        data={sortedTxs}
        defaultSortingID={'time'}
        showPagination
        loading={isLoading}
      />
    </div>
  );
}

export default TransactionsList;

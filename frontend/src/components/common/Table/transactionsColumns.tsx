import { ColumnDef } from '@tanstack/react-table';
import { useJetton } from 'src/hooks/jetton/useJetton';
import { formatDate } from 'src/utils/common/formatDate';
import { formatCurrency } from 'src/utils/common/formatCurrency';
import { JettonLogo } from '../JettonLogo';
import { HeaderItem } from './common';

interface IPoolPair {
  address: string;
  jetton0: {
    symbol: string;
    address: string;
    decimals: number;
  };
  jetton1: {
    symbol: string;
    address: string;
    decimals: number;
  };
}

export interface TX {
  now: Date;
  time: Date;
  hash: string;
  pool: IPoolPair;
  __typename: string;
  amount0: number;
  amount1: number;
  wallet: string;
}

function Time({ time, now }: TX) {
  return <span>{formatDate(time, now)}</span>;
}

function PoolPair({ pool }: TX) {
  const jettonA = useJetton(pool.jetton0.address);
  const jettonB = useJetton(pool.jetton1.address);

  if (!jettonA || !jettonB) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex">
        <JettonLogo jetton={jettonA} size={30} />
        <JettonLogo className="-ml-2" jetton={jettonB} size={30} />
      </div>
      <div>{`${jettonA.symbol} - ${jettonB.symbol}`}</div>
    </div>
  );
}

function Amount({
  pool,
  amount0,
  amount1,
  isFirst,
}: TX & { isFirst: boolean }) {
  const jetton = useJetton(
    isFirst ? pool.jetton0.address : pool.jetton1.address,
  );

  if (!jetton) return undefined;

  const amount = Number(isFirst ? amount0 : amount1) / 10 ** jetton.decimals;

  return (
    <div className="flex items-center justify-start gap-2">
      <JettonLogo jetton={jetton} size={30} />
      <span>{formatCurrency.format(amount)}</span>
    </div>
  );
}

export const transactionsColumns: ColumnDef<TX>[] = [
  {
    accessorKey: 'time',
    header: () => <HeaderItem className="ml-2">Time</HeaderItem>,
    cell: ({ row }) => <Time {...row.original} />,
    filterFn: (v, _, value) =>
      [v.original.time].join(' ').toLowerCase().includes(value),
  },
  {
    accessorKey: '__typename',
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Type
      </HeaderItem>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">Type</p>
        <span>{row.original.__typename}</span>
      </div>
    ),
  },
  {
    accessorKey: 'pool',
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Pool
      </HeaderItem>
    ),
    cell: ({ row }) => <PoolPair {...row.original} />,
  },
  {
    accessorKey: 'amount0',
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Token Amount
      </HeaderItem>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">Token Amount</p>
        <Amount {...row.original} isFirst />
      </div>
    ),
  },
  {
    accessorKey: 'amount1',
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Token Amount
      </HeaderItem>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">Token Amount</p>
        <Amount {...row.original} isFirst={false} />
      </div>
    ),
  },
  {
    accessorKey: 'wallet',
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Wallet
      </HeaderItem>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">Wallet</p>
        <span className="max-w-[150px] overflow-hidden truncate">
          {row.original.wallet}
        </span>
      </div>
    ),
  },
];

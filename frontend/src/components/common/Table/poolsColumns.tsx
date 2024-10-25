import { ColumnDef } from '@tanstack/react-table';
import { Jetton } from '@toncodex/sdk';
import { formatAmount } from 'src/utils/common/formatAmount';
import { formatPercent } from 'src/utils/common/formatPercent';
import { JettonLogo } from '../JettonLogo';
import { HeaderItem } from './common';

interface Pair {
  token0: Jetton;
  token1: Jetton;
}

export interface PoolColumn {
  id: string;
  pair: Pair;
  fee: number;
  tvlUSD: number;
  volume24USD: number;
  fees24USD: number;
  avgApr: number;
  isMyPool: boolean;
}

function PoolPair({ pair, fee }: PoolColumn) {
  const jettonA = pair.token0;
  const jettonB = pair.token1;

  if (!jettonA || !jettonB) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex">
        <JettonLogo jetton={jettonA} size={30} />
        <JettonLogo className="-ml-2" jetton={jettonB} size={30} />
      </div>
      <div>{`${jettonA.symbol} - ${jettonB.symbol}`}</div>
      <div className="rounded-xl bg-primary-red/30 px-2 py-1 text-sm text-pink-300">{`${fee / 100}%`}</div>
    </div>
  );
}

// const AvgAPR = ({
//     children,
//     avgApr,
//     farmApr,
//     maxApr,
// }: {
//     children: ReactNode;
//     avgApr: string;
//     farmApr: string | undefined;
//     maxApr: string;
// }) => {
//     return (
//         <HoverCard>
//             <HoverCardTrigger>{children}</HoverCardTrigger>
//             <HoverCardContent>
//                 <p>Avg. APR - {avgApr}</p>
//                 {farmApr && <p>Farm APR - {farmApr}</p>}
//                 <p>Max APR - {maxApr}</p>
//             </HoverCardContent>
//         </HoverCard>
//     );
// };

export const poolsColumns: ColumnDef<PoolColumn>[] = [
  {
    accessorKey: 'pair',
    accessorFn: ({ pair }) => pair,
    header: () => <HeaderItem className="ml-2">Pool</HeaderItem>,
    cell: ({ row }) => <PoolPair {...row.original} />,
    filterFn: (v, _, value) =>
      [
        v.original.pair.token0.symbol,
        v.original.pair.token1.symbol,
        v.original.pair.token0.symbol,
        v.original.pair.token1.symbol,
      ]
        .join(' ')
        .toLowerCase()
        .includes(value),
  },
  {
    accessorKey: 'tvlUSD',
    accessorFn: ({ tvlUSD }) => tvlUSD,
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        TVL
      </HeaderItem>
    ),
    cell: ({ getValue }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">TVL</p>
        <span>${formatAmount(getValue() as number, 4)}</span>
      </div>
    ),
  },
  {
    accessorKey: 'volume24USD',
    accessorFn: ({ volume24USD }) => volume24USD,
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Volume 24H
      </HeaderItem>
    ),
    cell: ({ getValue }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">Volume (24H)</p>
        <span>${formatAmount(getValue() as number, 4)}</span>
      </div>
    ),
  },
  {
    id: 'fees24USD',
    accessorKey: 'fees24USD',
    accessorFn: ({ fees24USD }) => fees24USD,
    enableHiding: true,
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Fees 24H
      </HeaderItem>
    ),
    cell: ({ getValue }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">Fees (24H)</p>
        <span>${formatAmount(getValue() as number, 4)}</span>
      </div>
    ),
  },
  {
    accessorKey: 'avgApr',
    accessorFn: ({ avgApr }) => avgApr,
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        APR
      </HeaderItem>
    ),
    cell: ({ getValue }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">APR (24H)</p>
        <span>{formatPercent.format(getValue() as number)}</span>
      </div>
    ),
  },
];

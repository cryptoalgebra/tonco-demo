import { ColumnDef } from '@tanstack/react-table';
import { useJetton } from 'src/hooks/jetton/useJetton';
import { formatAmount } from 'src/utils/common/formatAmount';
import { JettonLogo } from '../JettonLogo';
import { HeaderItem } from './common';

export interface JettonColumn {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  price: number;
  change: number;
  volume: number;
  tvl: number;
}

function JettonName({ id }: JettonColumn) {
  const jetton = useJetton(id.toString());

  return (
    <div className="flex items-center gap-4">
      <JettonLogo jetton={jetton} size={32} />
      <span>{jetton?.symbol}</span>
    </div>
  );
}

export const jettonsColumns: ColumnDef<JettonColumn>[] = [
  {
    accessorKey: 'pair',
    header: () => <HeaderItem className="ml-2">Jetton</HeaderItem>,
    cell: ({ row }) => <JettonName {...row.original} />,
    filterFn: (v, _, value) =>
      [v.original.symbol, v.original.id]
        .join(' ')
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Price
      </HeaderItem>
    ),
    cell: ({ getValue }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">Price</p>
        <span>${formatAmount(getValue() as number, 4)}</span>
      </div>
    ),
  },
  {
    accessorKey: 'change',
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        24H Change
      </HeaderItem>
    ),
    cell: ({ getValue }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">24H Change</p>
        <span>${formatAmount(getValue() as number, 4)}</span>
      </div>
    ),
  },
  {
    accessorKey: 'volume',
    header: ({ column }) => (
      <HeaderItem
        sort={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        isAsc={column.getIsSorted() === 'asc'}
      >
        Volume
      </HeaderItem>
    ),
    cell: ({ getValue }) => (
      <div className="flex flex-col items-start gap-1">
        <p className="opacity-50 sm:hidden">Volume</p>
        <span>${formatAmount(getValue() as number, 4)}</span>
      </div>
    ),
  },
  {
    accessorKey: 'tvl',
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
];

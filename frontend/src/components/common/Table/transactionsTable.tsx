import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from 'src/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/Table';
import { cn } from 'src/lib/cn';
import { LoadingState } from './loadingState';
import { TX } from './transactionsColumns';

interface TransactionsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  action?: (args?: unknown) => void;
  defaultSortingID?: keyof TX;
  link?: string;
  showPagination?: boolean;
  searchID?: keyof TX;
  loading?: boolean;
}

function TransactionsTable({
  columns,
  data,
  defaultSortingID,
  showPagination = true,
  loading,
}: TransactionsTableProps<TX, TX>) {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortingID ? [{ id: defaultSortingID, desc: true }] : [],
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        fees24USD: !(window.innerWidth < 640),
      },
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const startsFromRow =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const endsAtRow = Math.min(
    startsFromRow + table.getState().pagination.pageSize - 1,
    totalRows,
  );

  if (loading) return <LoadingState />;

  return (
    <>
      <Table className="flex flex-col gap-2 overflow-x-auto">
        <TableHeader className="flex w-full justify-between [&_tr]:border-b-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="flex w-full items-center justify-between"
            >
              {headerGroup.headers.map((header) =>
                window.innerWidth < 640 && header.id === 'pair' ? null : (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'h-fit w-[200px] rounded-xl text-left font-semibold text-muted first:text-left last:text-right sm:min-w-[150px]',
                      'max-sm:w-fit max-sm:px-2',
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ),
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          className={cn(
            'text-md flex w-max flex-col gap-2 hover:bg-transparent sm:text-[16px] lg:w-full',
            'max-sm:w-full',
          )}
        >
          {!table.getRowModel().rows.length ? (
            <TableRow className="h-full border-border-light hover:bg-light">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between rounded-lg border-border-light bg-lighter hover:bg-lighter/70',
                  'grid-cols-3 grid-rows-2 max-sm:grid max-sm:w-full max-sm:gap-2 max-sm:p-3',
                )}
                onClick={() => {
                  window.open(
                    `https://testnet.tonviewer.com/transaction/${row.original.hash}`,
                  );
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'flex h-20 w-[200px] items-center justify-start first:justify-start sm:min-w-[150px]',
                      'max-sm:h-fit max-sm:w-fit max-sm:justify-between max-sm:p-0 max-sm:first:col-span-3 max-sm:first:mr-auto max-sm:last:ml-auto',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {showPagination && (
        <div className="mt-auto flex items-center justify-end space-x-2 p-4">
          {totalRows > 0 && (
            <p className="mr-2">
              {startsFromRow === totalRows
                ? `${startsFromRow} of ${totalRows}`
                : `${startsFromRow} - ${endsAtRow} of ${totalRows}`}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}

export default TransactionsTable;

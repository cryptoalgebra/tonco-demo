import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/Table';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from 'src/components/ui/Button';
import { Input } from 'src/components/ui/Input';
import { cn } from 'src/lib/cn';
import { LoadingState } from './loadingState';
import { PoolColumn } from './poolsColumns';

interface PoolsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | [];
  action?: (args?: unknown) => void;
  defaultSortingID?: keyof PoolColumn;
  link?: string;
  showPagination?: boolean;
  searchID?: keyof PoolColumn;
  loading?: boolean;
}

function PoolsTable({
  columns,
  data,
  action,
  link,
  defaultSortingID,
  showPagination = true,
  loading,
}: PoolsTableProps<PoolColumn, unknown>) {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortingID ? [{ id: defaultSortingID, desc: true }] : [],
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const navigate = useNavigate();

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
    globalFilterFn: (row) => row.original.isMyPool === true,
  });

  const isMyPools: boolean | undefined = table.getState().globalFilter;

  const searchID = 'pair';

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
      {searchID && (
        <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
          <div className="relative flex w-fit items-center">
            <Input
              type="text"
              placeholder="Search pool"
              value={
                (table.getColumn(searchID)?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn(searchID)?.setFilterValue(event.target.value)
              }
              className="h-12 max-w-80 rounded-lg border border-border-light bg-lighter pl-12 text-sm outline-none focus:border-opacity-100 focus:ring-1 max-sm:w-full md:w-64 lg:w-80"
            />
            <Search className="text-border absolute left-4" size={20} />
          </div>
          <ul className="flex h-12 w-fit gap-1 rounded-lg border border-border-light p-1">
            <li>
              <Button
                onClick={() => table.setGlobalFilter(undefined)}
                className="h-full w-fit flex-nowrap rounded-[4px] p-4"
                variant={!isMyPools ? 'iconActive' : 'ghost'}
              >
                All
              </Button>
            </li>
            <li>
              <Button
                onClick={() => table.setGlobalFilter(true)}
                className="h-full w-fit whitespace-nowrap rounded-[4px] p-4"
                variant={isMyPools ? 'iconActive' : 'ghost'}
              >
                My pools
              </Button>
            </li>
          </ul>
          <div className="ml-auto flex w-fit items-center gap-2 max-md:gap-4 max-sm:hidden" />
          {/* <div className="flex gap-2 max-md:gap-4 items-center w-fit ml-auto max-sm:hidden">
                        <label className="flex gap-2 items-center" htmlFor="farmingAvailable">
                            <Tractor className="w-5 h-5 max-md:w-6 max-md:h-6" color="#d84eff" />
                            <span className="max-md:hidden">Farming Available</span>
                        </label>
                        <Switch
                            id="farmingAvailable"
                            checked={table.getColumn("plugins")?.getFilterValue() === true}
                            onCheckedChange={() => {
                                const column = table.getColumn("plugins");
                                if (column?.getFilterValue() === undefined) column?.setFilterValue(true);
                                else column?.setFilterValue(undefined);
                            }}
                        />
                    </div> */}
        </div>
      )}
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
                      'h-fit rounded-xl text-center font-semibold text-muted first:text-left sm:min-w-[150px] sm:first:min-w-[300px]',
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
                  if (action) {
                    action(row.original.id);
                  } else if (link) {
                    navigate(`/${link}/${row.original.id}`);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'flex h-20 items-center justify-center first:justify-start sm:min-w-[150px] sm:first:min-w-[300px]',
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
        <div className="sm: mt-auto flex items-center justify-end space-x-2 p-2 sm:p-4">
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
export default PoolsTable;

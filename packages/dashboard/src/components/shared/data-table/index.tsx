import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { AppError } from "../../../types/app-error";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: {
    page: number;
    pageSize: number;
    totalPage: number;
  };
  onPageChange: (page: number) => void;
  isLoading?: boolean
  error: AppError | null
};

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
  isLoading = false,
  error
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: pagination.totalPage,
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
  });

  function nextPage() {
    if (!table.getCanNextPage()) return;
    onPageChange(table.getState().pagination.pageIndex + 2);
  }

  function previousPage() {
    if (!table.getCanPreviousPage()) return;
    onPageChange(table.getState().pagination.pageIndex);
  }


  return (
    <>
      <div className="rounded border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ?  <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow> : error !== null ?   <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {error.message}
                </TableCell> :   table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
    
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

     {pagination.totalPage > 0 && <div className="flex py-4 space-x-8 justify-end items-center">
 <p className="font-medium text-sm"> Page {pagination.page} of {pagination.totalPage}</p>
       <div className="space-x-4"> 
       <Button variant="outline" disabled={!table.getCanPreviousPage()} onClick={previousPage}>
          Previous
        </Button>
        <Button variant="outline" disabled={!table.getCanNextPage()} onClick={nextPage}>
          Next
        </Button>
       </div>
      </div>}
    </>
  );
}

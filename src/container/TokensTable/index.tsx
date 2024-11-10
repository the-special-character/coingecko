"use client";

import {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  Header,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

// needed for row & cell level scope DnD setup
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import data, { Coin } from "@/data/coinList";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

export const columns: ColumnDef<Coin>[] = [
  {
    id: "market_cap_rank",
    accessorKey: "market_cap_rank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("market_cap_rank")}</div>
    ),
    size: 60,
    enableSorting: true,
    enableHiding: false,
    enablePinning: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Coin
          <ArrowUpDown />
        </Button>
      );
    },
    size: 100,
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: false,
    enablePinning: true,
  },
  {
    id: "current_price",
    accessorKey: "current_price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {new Intl.NumberFormat("en-US", {
          currency: "USD",
          style: "currency",
        }).format(row.getValue("current_price"))}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "price_change_percentage_1h_in_currency",
    accessorKey: "price_change_percentage_1h_in_currency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          1h
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = Number(
        row.getValue("price_change_percentage_1h_in_currency")
      );
      return (
        <div
          className={cn({
            "text-green-500": Math.sign(value) === 1,
            "text-red-500": Math.sign(value) !== 1,
          })}
        >
          {new Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value)}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "price_change_percentage_24h_in_currency",
    accessorKey: "price_change_percentage_24h_in_currency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          24h
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = Number(
        row.getValue("price_change_percentage_24h_in_currency")
      );
      return (
        <div
          className={cn({
            "text-green-500": Math.sign(value) === 1,
            "text-red-500": Math.sign(value) !== 1,
          })}
        >
          {new Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value)}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "price_change_percentage_7d_in_currency",
    accessorKey: "price_change_percentage_7d_in_currency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          7d
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = Number(
        row.getValue("price_change_percentage_7d_in_currency")
      );
      return (
        <div
          className={cn({
            "text-green-500": Math.sign(value) === 1,
            "text-red-500": Math.sign(value) !== 1,
          })}
        >
          {new Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value)}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "total_volume",
    accessorKey: "total_volume",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total_volume
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {new Intl.NumberFormat("en-US", {
          currency: "USD",
          style: "currency",
        }).format(row.getValue("total_volume"))}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "market_cap",
    accessorKey: "market_cap",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Market Cap
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {new Intl.NumberFormat("en-US", {
          currency: "USD",
          style: "currency",
        }).format(row.getValue("market_cap"))}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "sparkline_in_7d",
    header: () => {
      return <span>Last 7 Days</span>;
    },
    cell: ({ row }) => {
      const price = row.original.sparkline_in_7d.price;
      if (!price || price.length === 0) {
        return <div>No data available</div>;
      }

      const formattedData = [
        {
          id: "price",
          color: "hsl(120, 100%, 50%)",
          data: price.map((x, i) => ({
            x: i.toString(),
            y: x,
          })),
        },
      ];

      return (
        <div style={{ height: "80px", width: "100%" }}>
          <ResponsiveLine
            data={formattedData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            enableGridX={false}
            enableGridY={false}
            lineWidth={1}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabel="data.yFormatted"
            pointLabelYOffset={-24}
            isInteractive={false}
            enableCrosshair={false}
            legends={[]}
          />
        </div>
      );
    },
    size: 150,
    enableSorting: false,
  },
];

const DraggableTableHeader = ({
  header,
}: {
  header: Header<Coin, unknown>;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "all 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging || header.column.getIsPinned() ? 1 : 0,
    backgroundColor: "white",
    left: header.column.getIsPinned() ? `${header.getStart()}px` : undefined,
    position: header.column.getIsPinned() ? "sticky" : "relative",
  };

  return (
    <TableHead colSpan={header.colSpan} ref={setNodeRef} style={style}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {!header.column.getIsPinned() && (
        <button {...attributes} {...listeners}>
          🟰
        </button>
      )}
    </TableHead>
  );
};

const DragAlongCell = ({ cell }: { cell: Cell<Coin, unknown> }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "all 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging || cell.column.getIsPinned() ? 1 : 0,
    backgroundColor: "white",
    left: cell.column.getIsPinned() ? `${cell.column.getStart()}px` : undefined,
    position: cell.column.getIsPinned() ? "sticky" : "relative",
  };

  return (
    <TableCell style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map((c) => c.id!)
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["market_cap_rank", "name"],
    right: [],
  });
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnPinningChange: setColumnPinning,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder,
      pagination,
      columnPinning,
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="w-full">
          <div className="flex items-center py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableTableHeader key={header.id} header={header} />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <SortableContext
                          key={cell.id}
                          items={columnOrder}
                          strategy={horizontalListSortingStrategy}
                        >
                          <DragAlongCell key={cell.id} cell={cell} />
                        </SortableContext>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
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
          </div>
        </div>
      </DndContext>
    </>
  );
}

export default DataTableDemo;

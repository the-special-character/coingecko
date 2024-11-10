"use client";

import {
  ColumnDef,
  ColumnPinningState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { z } from "zod";

// needed for row & cell level scope DnD setup
import { useCallback, useEffect, useMemo, useState } from "react";
import { Coin } from "@/data/coinList";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  atomWithStorage,
  createJSONStorage,
  unstable_withStorageValidator as withStorageValidator,
} from "jotai/utils";
import { useAtom } from "jotai";
import CustomizeView, {
  FormSchema,
  CustomizedViewType,
} from "../CustomizeView";
import DNDTable from "../DNDTable";
import TablePagination from "../TablePagination";
import { useCoins } from "@/hooks/useCoins";

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
      <div className="capitalize text-center">
        {row.getValue("market_cap_rank")}
      </div>
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
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("name")}</div>
    ),
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
      <div className="text-end">
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
          className={cn("text-end", {
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
          className={cn("text-end", {
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
          className={cn("text-end", {
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
      <div className="text-end">
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
      <div className="text-end">
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
        <div style={{ height: "60px", width: "100%" }}>
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

const isValidCustomizedView = (v: unknown): v is CustomizedViewType[] =>
  z.array(FormSchema).safeParse(v).success;

const customizedViewAtom = atomWithStorage<CustomizedViewType[]>(
  "customizedViewList",
  [],
  withStorageValidator(isValidCustomizedView)(createJSONStorage())
);

function DataTableDemo() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  console.log("pagination", pagination);

  const { data, status, error } = useCoins(pagination);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["market_cap_rank", "name"],
    right: [],
  });
  const [customizedViewList, setCustomizedViewList] =
    useAtom(customizedViewAtom);

  const currantView = useMemo(
    () => customizedViewList.find((x) => x.visible),
    [customizedViewList]
  );

  const onTableChange = useCallback(
    <T extends CustomizedViewType | SortingState>(
      key: keyof CustomizedViewType | keyof SortingState
    ) => {
      return (
        updater:
          | ((
              prev: CustomizedViewType | SortingState
            ) => CustomizedViewType | SortingState)
          | CustomizedViewType
          | ((prev: T) => T)
      ) => {
        setCustomizedViewList((val) => {
          const index = val.findIndex((x) => x.visible);
          const newData =
            updater instanceof Function
              ? updater(
                  val[index][key as keyof CustomizedViewType] as unknown as T
                )
              : updater;
          return [
            ...val.slice(0, index),
            { ...val[index], [key]: newData },
            ...val.slice(index + 1),
          ];
        });
      };
    },
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: onTableChange<SortingState>("sorting") as (
      updater: SortingState | ((prev: SortingState) => SortingState)
    ) => void,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: onTableChange<VisibilityState>(
      "columnVisibility"
    ) as (
      updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
    ) => void,
    onPaginationChange: setPagination,
    onColumnPinningChange: setColumnPinning,
    manualPagination: true,
    state: {
      columnPinning,
      pagination,
      sorting: currantView?.sorting,
      columnVisibility: currantView?.columnVisibility,
      columnOrder: currantView?.columnOrder,
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setCustomizedViewList((val) => {
        const index = val.findIndex((x) => x.visible);
        const { columnOrder } = val[index];
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return [
          ...val.slice(0, index),
          {
            ...val[index],
            columnOrder: arrayMove(columnOrder, oldIndex, newIndex),
          },
          ...val.slice(index + 1),
        ];
      });
    }
  }

  useEffect(() => {
    setCustomizedViewList((val) => {
      if (val.length === 0) {
        return [
          {
            name: "default",
            sorting: [],
            columnVisibility: {},
            columnOrder: columns.map((c) => c.id!),
            visible: true,
          },
        ];
      }
      return val;
    });
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <RadioGroup
            value={currantView?.name}
            onValueChange={(value) =>
              setCustomizedViewList((val) =>
                val.map((x) => ({ ...x, visible: value === x.name }))
              )
            }
            className="flex"
          >
            {customizedViewList.map((x) => (
              <Label
                htmlFor={x.name}
                key={x.name}
                className="flex items-center space-x-2 border px-4 py-2 rounded-md [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value={x.name} id={x.name} />
                <span className="capitalize">{x.name}</span>
              </Label>
            ))}
          </RadioGroup>
          <CustomizeView
            table={table}
            columns={columns}
            setCustomizedViewList={setCustomizedViewList}
          />
        </div>
        <div className="rounded-md border">
          <DNDTable
            table={table}
            columns={columns}
            items={currantView?.columnOrder || []}
            handleDragEnd={handleDragEnd}
            status={status}
            error={error}
          />
        </div>
        <TablePagination table={table} />
      </div>
    </>
  );
}

export default DataTableDemo;

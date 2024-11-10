import React from "react";
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
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Cell,
  ColumnDef,
  flexRender,
  Header,
  Table as TanTable,
} from "@tanstack/react-table";
import { Coin } from "@/data/coinList";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  table: TanTable<Coin>;
  columns: ColumnDef<Coin>[];
  items: string[];
  handleDragEnd: (event: DragEndEvent) => void;
  status: "error" | "success" | "pending";
  error: Error | null;
};

const DNDTable = ({
  table,
  columns,
  items,
  handleDragEnd,
  status,
  error,
}: Props) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

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
      left: cell.column.getIsPinned()
        ? `${cell.column.getStart()}px`
        : undefined,
      position: cell.column.getIsPinned() ? "sticky" : "relative",
    };

    return (
      <TableCell style={style} ref={setNodeRef}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <SortableContext
                items={items}
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
          <TableRow>
            {status === "pending" && (
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            )}
            {status === "error" && (
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {error?.message}
              </TableCell>
            )}
            {status === "success" && !table.getRowModel().rows?.length && (
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            )}
          </TableRow>

          {status === "success" &&
            table.getRowModel().rows?.length &&
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <SortableContext
                    key={cell.id}
                    items={items}
                    strategy={horizontalListSortingStrategy}
                  >
                    <DragAlongCell key={cell.id} cell={cell} />
                  </SortableContext>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </DndContext>
  );
};

export default DNDTable;

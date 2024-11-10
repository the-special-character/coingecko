import { Button } from "@/components/ui/button";
import { Coin } from "@/data/coinList";
import { Table } from "@tanstack/react-table";
import React from "react";

type Props = {
  table: Table<Coin>;
};

const TablePagination = ({ table }: Props) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;

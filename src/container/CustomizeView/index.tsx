import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ColumnDef,
  SortingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table";
import { Coin } from "@/data/coinList";
import { SetStateAction } from "jotai";

const columnLabels: Record<string, string> = {
  market_cap_rank: "Market Cap Rank",
  name: "Coin Name",
  current_price: "Current Price",
  price_change_percentage_1h_in_currency: "1 Hour Change",
  price_change_percentage_24h_in_currency: "24 Hour Change",
  price_change_percentage_7d_in_currency: "7 Day Change",
  total_volume: "Total Volume",
  market_cap: "Market Cap",
  sparkline_in_7d: "Last 7 Days",
};

export const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  columnVisibility: z.record(z.boolean()),
  sorting: z.array(z.any()),
  columnOrder: z.array(z.string()),
  visible: z.boolean(),
});

export type CustomizedViewType = {
  name: string;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnOrder: string[];
  visible: boolean;
};

type Props = {
  table: Table<Coin>;
  columns: ColumnDef<Coin>[];
  setCustomizedViewList: (value: SetStateAction<CustomizedViewType[]>) => void;
};

const CustomizeView = ({ table, columns, setCustomizedViewList }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      columnVisibility: columns.reduce(
        (p, c) => ({ ...p, [c.id as string]: c.enablePinning ?? false }),
        {}
      ),
      sorting: [],
      columnOrder: columns.map((c) => c.id!),
      visible: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setCustomizedViewList((val) => [
      ...val.map((x) => ({ ...x, visible: false })),
      data,
    ]);
    setIsDialogOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Customize View
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Create Customized View</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customized Table Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="columnVisibility"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Table Fields</FormLabel>
                      <FormDescription>
                        Select the items you want to display in the table.
                      </FormDescription>
                    </div>
                    {table.getAllColumns().map((column) => {
                      return (
                        <FormItem
                          key={column.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={
                                field.value[
                                  column.id as keyof typeof field.value
                                ]
                              }
                              onCheckedChange={(checked) => {
                                return field.onChange({
                                  ...field.value,
                                  [column.id]: checked,
                                } as Record<string, boolean>);
                              }}
                              disabled={!column.getCanHide()}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {columnLabels[column.id] || column.id}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeView;

"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import type { TableColumnProps } from "@/collection/ui/table";
import { TableColumn } from "@/collection/ui/table";
import type { SortingDirection } from "@/lib/data-table/core";

export interface TableSortingColumnProps<
  TAllKeys extends readonly string[],
  TKeys extends TAllKeys[number],
  TData extends object,
> extends Omit<TableColumnProps<TData>, "allowsSorting"> {
  state: {
    value: {
      key: TKeys | undefined;
      direction: SortingDirection;
    };
    set: (args: { key?: TKeys; direction?: SortingDirection }) => void;
  };
  sortBy: TKeys;
  text: string;
}

export const TableSortingColumn = <
  TAllKeys extends readonly string[],
  TKeys extends TAllKeys[number],
  TData extends object,
>({
  state,
  sortBy,
  text,
  ...props
}: TableSortingColumnProps<TAllKeys, TKeys, TData>) => {
  return (
    <TableColumn id={sortBy} allowsSorting {...props}>
      <div className="flex items-center">
        <span className={"mr-2"}>{text}</span>
        {state.value.key === sortBy ? (
          state.value.direction === "asc" ? (
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown aria-hidden="true" className="h-4 w-4" />
        )}
      </div>
    </TableColumn>
  );
};

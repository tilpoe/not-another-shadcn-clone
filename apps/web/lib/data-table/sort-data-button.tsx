import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/collection/ui/button";
import type { SortingDirection } from "@/lib/data-table/core";

export const SortDataButton = <
  T extends readonly string[],
  Keys extends T[number],
>({
  state,
  sortBy,
  text,
}: {
  state: {
    value: {
      key: Keys | undefined;
      direction: SortingDirection;
    };
    set: (args: { key?: Keys; direction?: SortingDirection }) => void;
  };
  sortBy: Keys;
  text: string;
}) => {
  const { value: get, set } = state;

  return (
    <Button
      variant="ghost"
      onPress={() => {
        const direction =
          state.value.key === sortBy && state.value.direction === "asc"
            ? "desc"
            : "asc";
        set({ key: sortBy, direction });

        /*         set({
          key: sortBy,
          direction:
            state.value.key === sortBy
              ? state.value.direction === "asc"
                ? "desc"
                : "asc"
              : "asc",
        }); */
      }}
    >
      <span className={"mr-2"}>{text}</span>
      {get.key === sortBy ? (
        get.direction === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4" />
      )}
      {/*       <span className={"mr-2"}>{text}</span>
      {get.key !== sortBy && <ArrowUpDown className="h-4 w-4" />}
      {get.key === sortBy && get.direction === "asc" && (
        <ArrowUp className="h-4 w-4" />
      )}
      {get.key === sortBy && get.direction === "desc" && (
        <ArrowDown className="h-4 w-4" />
      )} */}
    </Button>
  );
};

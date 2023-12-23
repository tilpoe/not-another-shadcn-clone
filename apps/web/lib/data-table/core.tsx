/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Loader2 } from "lucide-react";
import type { SortDescriptor } from "react-aria-components";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { ArrayItem, Slice } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*                                 PAGINATION                                 */
/* -------------------------------------------------------------------------- */

export type PaginationLimit = 20 | 50 | "all";

export interface PaginationState {
  value: {
    page: number;
    limit: 20 | 50 | "all";
  };
  set: ({ page, limit }: { page?: number; limit?: PaginationLimit }) => void;
}

export interface PaginationSlice {
  pagination: PaginationState;
}

export function createPaginationSlice(defaultValues?: {
  page?: number;
  limit?: PaginationLimit;
}) {
  const slice: Slice<PaginationSlice> = (set) => ({
    pagination: {
      value: {
        page: defaultValues?.page ?? 1,
        limit: defaultValues?.limit ?? 20,
      },
      set: ({ page, limit }) => {
        set((state) => {
          if (page) {
            state.pagination.value.page = page;
          }

          if (limit) {
            state.pagination.value.limit = limit;
          }
        });
      },
    },
  });

  return slice;
}

/* -------------------------------------------------------------------------- */
/*                                   SORTING                                  */
/* -------------------------------------------------------------------------- */

export type SortingDirection = "asc" | "desc";

export interface SortingState<T extends readonly string[]> {
  value: {
    key: T[number] | undefined;
    direction: SortingDirection;
  };
  set: (args: { key?: T[number]; direction?: SortingDirection }) => void;
}

export type SortingAlgorithms<
  DataArray extends any[],
  T extends readonly string[],
> = {
  [key in T[number]]: (
    a: ArrayItem<DataArray>,
    b: ArrayItem<DataArray>,
  ) => {
    asc: number;
    desc: number;
  };
};

export interface SortingSlice<
  DataArray extends any[],
  T extends readonly string[],
> {
  sorting: SortingState<T> & {
    sortingAlgorithms: SortingAlgorithms<DataArray, T>;
  };
}

export const createSortingSlice = <
  DataArray extends any[],
  T extends readonly string[],
>(sortingAlgorithms: {
  [key in T[number]]: (
    a: ArrayItem<DataArray>,
    b: ArrayItem<DataArray>,
  ) => {
    asc: number;
    desc: number;
  };
}) => {
  const slice: Slice<SortingSlice<DataArray, T>> = (set) => ({
    sorting: {
      value: {
        direction: "asc",
        key: undefined,
      },
      set: ({ key, direction }) => {
        set((state) => {
          if (key) {
            // @ts-expect-error Don't know how to fix this, but should theoratically be fine 🥶
            state.sorting.value.key = key;
          }

          if (direction) {
            state.sorting.value.direction = direction;
          }
        });
      },
      sortingAlgorithms,
    },
  });

  return slice;
};

export type InferSortingSlice<T> = T extends Slice<infer U> ? U : never;

/* -------------------------------------------------------------------------- */
/*                                    STORE                                   */
/* -------------------------------------------------------------------------- */

/**
 * This store manages all the data filtering, sorting and pagination.
 *
 * You have to manually provide the generics for this function.
 *
 * 1. Generic type
 * Declare the types of all filters you want to use.
 *
 * 2. Generic Type
 * Declare the type of the data array you want to filter.
 *
 * 3. Generic Type
 * Declare all keys for which you want to sort the table. You can choose
 * any name you want because the mapping to the actual data is done in the
 * function function parameters.
 *
 * @param filterSlice Define the store.
 * @param sortingAlgorithms Define which sorting algorithms should be used for the declared keys.
 * @returns
 */
export const createDataStore = <
  TFilterSlice extends Record<string, { value: unknown; set: unknown }>,
  TDataArray extends any[] = [],
  const TKeys extends readonly string[] = [],
>(
  filterSlice: Slice<TFilterSlice>,
  sortingAlgorithms: {
    [key in TKeys[number]]: (
      a: ArrayItem<TDataArray>,
      b: ArrayItem<TDataArray>,
    ) => {
      asc: number;
      desc: number;
    };
  },
) => {
  const paginationSlice = createPaginationSlice();
  const sortingSlice = createSortingSlice<TDataArray, TKeys>(sortingAlgorithms);

  return create<
    TFilterSlice & PaginationSlice & InferSortingSlice<typeof sortingSlice>
  >()(
    immer((...args) => ({
      ...filterSlice(...(args as [any, any, any])),
      ...paginationSlice(...(args as [any, any, any])),
      ...sortingSlice(...(args as [any, any, any])),
    })),
  );
};

/* -------------------------------------------------------------------------- */
/*                             SORTING ALGORITHMS                             */
/* -------------------------------------------------------------------------- */

export const defaultStringSort = (a: string, b: string) => ({
  asc: a.localeCompare(b),
  desc: b.localeCompare(a),
});

export const defaultNumberSort = (a: number, b: number) => ({
  asc: a - b,
  desc: b - a,
});

export const defaultDateSort = (a: Date, b: Date) => ({
  asc: a.getTime() - b.getTime(),
  desc: b.getTime() - a.getTime(),
});

export const defaultBooleanSort = (a: boolean, b: boolean) => ({
  asc: a === b ? 0 : a ? 1 : -1,
  desc: a === b ? 0 : a ? -1 : 1,
});

/* -------------------------------------------------------------------------- */
/*                               MAIN FUNCTIONS                               */
/* -------------------------------------------------------------------------- */

export function sortAndPaginate<DataType, T extends string[]>(
  data: DataType[],
  state?: {
    pagination?: PaginationState;
    sorting?: SortingState<T> & {
      sortingAlgorithms: SortingAlgorithms<DataType[], T>;
    };
  },
): {
  data: DataType[];
  total: number;
} {
  const total = data.length;
  let dataCopy = [...data];

  if (dataCopy.length === 0) {
    return {
      data,
      total: 0,
    };
  }

  if (state?.sorting && state.sorting.value.key) {
    dataCopy = dataCopy.sort((a, b) => {
      if (!state.sorting?.value.key) {
        throw new Error("Undefined key.");
      }

      const algo = state.sorting.sortingAlgorithms[state.sorting.value.key];
      return algo(a, b)[state.sorting.value.direction];
    });
  }

  if (state?.pagination && state.pagination.value.limit !== "all") {
    dataCopy = dataCopy.slice(
      (state.pagination.value.page - 1) * state.pagination.value.limit,
      state.pagination.value.page * state.pagination.value.limit,
    );
  }

  return {
    data: dataCopy,
    total,
  };
}

/**
 * Obligatory dependencies:
 * - data
 * - pagination.value
 * - sorting.value
 *
 * You also have to declare the filter values from the store as dependencies.
 */
export const filterData = <
  TData extends any[],
  TFilteredData extends {
    result: TData;
  },
>(config: {
  data: TData | undefined;
  store: {
    pagination: PaginationState;
    sorting: SortingState<any>;
  };
  filter: (data: TData) => TFilteredData;
}):
  | (Omit<TFilteredData, "result"> & {
      result: {
        data: TData;
        total: number;
      };
    })
  | null => {
  if (config.data) {
    const { result, ...filtered } = config.filter(config.data);

    return {
      ...filtered,
      result: sortAndPaginate(result, {
        pagination: config.store.pagination,
        sorting: config.store.sorting as any,
      }),
    } as any;
  }

  return null;
};

export const getDataTableProps = <
  TAllKeys extends readonly string[],
  TKeys extends TAllKeys[number],
>(state: {
  value: {
    key: TKeys | undefined;
    direction: SortingDirection;
  };
  set: (args: { key?: TKeys; direction?: SortingDirection }) => void;
}): {
  onSortChange: (descriptor: SortDescriptor) => void;
  sortDescriptor: SortDescriptor;
} => {
  return {
    onSortChange: (descriptor) => {
      state.set({
        key: descriptor.column as any,
        direction: descriptor.direction === "ascending" ? "asc" : "desc",
      });
    },
    sortDescriptor: {
      column: state.value.key,
      direction: state.value.direction === "asc" ? "ascending" : "descending",
    },
  };
};

export const renderEmptyState = (text: string, isPending?: boolean) => () => {
  if (isPending) {
    return <Loader2 className="h-6 w-full animate-spin" />;
  }

  return <>{text}</>;
};

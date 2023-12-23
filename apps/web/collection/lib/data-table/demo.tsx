"use client";

import { useMemo } from "react";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/collection/ui/card";
import { SearchField } from "@/collection/ui/search-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/collection/ui/table";
import {
  createDataStore,
  defaultNumberSort,
  defaultStringSort,
  filterData,
  getDataTableProps,
  renderEmptyState,
} from "@/lib/data-table/core";
import { Paginator } from "@/lib/data-table/paginator";
import { TableSortingColumn } from "@/lib/data-table/table-sorting-column";

/**
 * Mock data.
 */
function useGetStudents() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
  }));
}

type Students = { id: number; name: string }[];

/**
 * Declaring the store that handles the filter/sorting/pagination state.
 */
const useStudentsStore = createDataStore<
  {
    search: {
      value: string;
      set: (search: string) => void;
    };
  },
  Students,
  ["id", "name"]
>(
  (set) => ({
    search: {
      value: "",
      set: (search) => {
        set((state) => {
          state.search.value = search;
        });
      },
    },
  }),
  {
    id: (a, b) => defaultNumberSort(a.id, b.id),
    name: (a, b) => defaultStringSort(a.name, b.name),
  },
);

const useFilterStudents = (data?: Students) => {
  const { pagination, sorting, search } = useStudentsStore();

  return useMemo(() => {
    return filterData({
      data,
      store: { pagination, sorting },
      filter: (data) => {
        const result = data.filter((student) => {
          if (search.value) {
            if (
              !student.name.toLowerCase().includes(search.value.toLowerCase())
            ) {
              return false;
            }
          }

          return true;
        });

        return {
          result,
        };
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pagination.value, sorting.value, search.value]);
};

export default function Demo() {
  const { pagination, sorting, search } = useStudentsStore();
  const rawStudents = useGetStudents();
  const students = useFilterStudents(rawStudents);

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="border-b">
          <CardHeading>
            <CardTitle>Students</CardTitle>
          </CardHeading>
          <CardActions>
            <SearchField
              placeholder="Search for student"
              value={search.value}
              onChange={search.set}
              aria-label="Search for student"
            />
          </CardActions>
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-auto p-0">
          <div>
            <Table
              ariaLabel="students"
              stickyHeader
              {...getDataTableProps(sorting)}
            >
              <TableHead>
                <TableSortingColumn
                  state={sorting}
                  sortBy="id"
                  text="ID"
                  isRowHeader
                />
                <TableSortingColumn state={sorting} sortBy="name" text="Name" />
              </TableHead>
              <TableBody
                items={students?.result.data}
                renderEmptyState={renderEmptyState("No students found.")}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Paginator
              className="border-t"
              state={pagination}
              total={students?.result.total}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

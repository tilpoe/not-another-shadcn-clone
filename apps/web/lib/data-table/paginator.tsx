"use client";

import { useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/collection/ui/button";
import type { SelectOption, SelectOptions } from "@/collection/ui/select";
import { Select } from "@/collection/ui/select";
import type { PaginationLimit, PaginationState } from "@/lib/data-table/core";
import { cn } from "@/lib/utils";

const selectLimitOptions: SelectOptions<PaginationLimit> = [
  {
    label: "20",
    value: 20,
  },
  {
    label: "50",
    value: 50,
  },
  {
    label: "Alle",
    value: "all",
  },
];

const PageButton = ({
  disabled,
  onClick,
  icon,
}: {
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) => {
  return (
    <Button
      variant="ghost"
      isDisabled={disabled}
      className="group flex rounded-full enabled:hover:bg-muted"
      onClick={onClick}
    >
      <Slot className="h-4 w-4 text-muted-foreground group-disabled:text-gray-300">
        {icon}
      </Slot>
    </Button>
  );
};

export const Paginator = ({
  state,
  total,
  className,
}: {
  state: PaginationState;
  total: number | undefined;
  className?: string;
}) => {
  const pagination = state.value;
  const currentLimit = selectLimitOptions.find(
    (option) => option.value === state.value.limit,
  );

  if (!currentLimit) {
    throw new Error("Invalid limit, this shouldn't happen.");
  }

  const [limit, setLimit] =
    useState<SelectOption<PaginationLimit>>(currentLimit);

  if (!total || total <= 0) {
    return null;
  }

  const isFirstPage = pagination.page === 1;
  const isLastPage =
    pagination.limit === "all" ||
    pagination.page === Math.ceil(total / pagination.limit);
  const canGoBack = pagination.limit !== "all" && pagination.page !== 1;
  const canGoForward =
    pagination.limit !== "all" && pagination.limit * pagination.page <= total;

  const goToFirstPage = () => state.set({ page: 1 });
  const goToPreviousPage = () =>
    canGoBack && state.set({ page: pagination.page - 1 });
  const goToNextPage = () =>
    canGoForward && state.set({ page: pagination.page + 1 });
  const goToLastPage = () =>
    !isLastPage &&
    pagination.limit !== "all" &&
    state.set({ page: Math.ceil(total / pagination.limit) });

  return (
    <div
      className={cn(
        "flex h-16 min-h-[4rem] items-center justify-between px-4",
        className,
      )}
    >
      <div className="flex items-center">
        <PageButton
          disabled={isFirstPage}
          onClick={goToFirstPage}
          icon={<ChevronsLeft />}
        />
        <PageButton
          disabled={isFirstPage}
          onClick={goToPreviousPage}
          icon={<ChevronLeft />}
        />
        <div className="mx-3 space-x-2 text-sm text-muted-foreground">
          <span>{pagination.page}</span>
          <span>von</span>
          <span>
            {pagination.limit === "all"
              ? 1
              : Math.ceil(total / pagination.limit)}
          </span>
        </div>
        <PageButton
          disabled={!canGoForward}
          onClick={goToNextPage}
          icon={<ChevronRight />}
        />
        <PageButton
          disabled={isLastPage}
          onClick={goToLastPage}
          icon={<ChevronsRight />}
        />
      </div>
      <div>
        <Select
          className="w-14"
          options={selectLimitOptions}
          value={limit}
          onChange={setLimit}
          onSelect={(option) => state.set({ limit: option.value })}
        />
      </div>
    </div>
  );
};

"use client";

import { createContext, useContext, useMemo } from "react";
import { cva } from "cva";
import type {
  ColumnProps,
  TableBodyProps as RaTableBodyProps,
  RowProps,
} from "react-aria-components";
import {
  Cell as RaCell,
  Column as RaColumn,
  Row as RaRow,
  Table as RaTable,
  TableBody as RaTableBody,
  TableHeader as RaTableHeader,
} from "react-aria-components";

import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

interface TableContextValues {
  bodySize?: "sm" | "default" | "lg";
  headerSize?: "sm" | "default" | "lg";
  stickyHeader?: boolean;
}

const TableContext = createContext<TableContextValues | null>(null);

function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

interface CellProps {
  cellWidth?: number;
  align?: "left" | "center" | "right";
}

const getCellStyle = ({ cellWidth, align }: CellProps) => {
  return {
    textAlign: align,
    width: cellWidth ? `${cellWidth}%` : undefined,
  };
};

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const tableVariants = {
  wrapper: cva({
    base: "w-full grow overflow-auto",
  }),
  root: cva({
    base: "w-full caption-bottom text-sm",
  }),
  header: cva({
    base: "[&_tr]:border-b",
  }),
  body: cva({
    base: "[&_tr:last-child]:border-0 [&_tr_>_td:last-child]:s-empty:p-4 [&_tr_>_td:last-child]:s-empty:text-center s-empty:text-sm s-empty:text-muted-foreground",
  }),
  row: cva({
    base: "border-b transition-colors s-focus:outline-none",
  }),
  column: cva({
    base: "text-left align-middle font-medium text-muted-foreground [&>[role=checkbox]]:translate-y-[2px] s-focus:outline-none s-allows-sorting:cursor-pointer",
    variants: {
      stickyHeader: {
        true: "sticky top-0 z-50 bg-white drop-shadow",
        false: "",
      },
    },
    defaultVariants: {
      stickyHeader: false,
    },
  }),
  cell: cva({
    base: cn("px-4 align-middle [&:has([role=checkbox])]:pr-0"),
    variants: {
      size: {
        sm: "h-12",
        default: "h-14",
        lg: "h-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

export type TableProps = React.ComponentPropsWithRef<typeof RaTable> &
  TableContextValues & {
    ariaLabel: string;
    classNames?: {
      wrapper?: string;
      root?: string;
    };
  };

export const Table = autoRef(
  ({
    className,
    classNames,
    ariaLabel,
    bodySize = "default",
    stickyHeader,
    headerSize = "default",
    ...props
  }: TableProps) => {
    const tableContextValues = useMemo(
      () => ({ bodySize, stickyHeader, headerSize }),
      [bodySize, stickyHeader, headerSize],
    );

    return (
      <TableContext.Provider value={tableContextValues}>
        <div
          className={cn(
            tableVariants.wrapper(),
            className,
            classNames?.wrapper,
          )}
        >
          <RaTable
            className={cn(tableVariants.root(), classNames?.root)}
            aria-label={ariaLabel}
            {...props}
          />
        </div>
      </TableContext.Provider>
    );
  },
);

/* ---------------------------------- Body ---------------------------------- */

export type TableBodyProps<TData extends object> = RaTableBodyProps<TData> & {
  ref?: React.ComponentPropsWithRef<typeof RaTableBody>["ref"];
};

const TableBodyInteral = <TData extends object>({
  className,
  ...props
}: TableBodyProps<TData>) => {
  return (
    <RaTableBody<TData>
      className={cn(tableVariants.body(), className)}
      {...props}
    />
  );
};

export const TableBody = autoRef(TableBodyInteral);

/* ---------------------------------- Head ---------------------------------- */

export type TableHeadProps = React.ComponentPropsWithRef<typeof RaTableHeader>;

export const TableHead = autoRef(({ className, ...props }: TableHeadProps) => {
  return (
    <RaTableHeader
      className={cn(tableVariants.header(), className)}
      {...props}
    />
  );
});

/* --------------------------------- Column --------------------------------- */

export interface TableColumnProps<TData extends object>
  extends ColumnProps<TData>,
    CellProps {
  ref?: React.ComponentPropsWithRef<typeof RaColumn>["ref"];
}

const TableColumnInternal = <TData extends object>({
  className,
  cellWidth,
  align,
  ...props
}: TableColumnProps<TData>) => {
  const { stickyHeader, headerSize } = useTableContext();

  return (
    <RaColumn
      className={cn(
        tableVariants.cell({ size: headerSize }),
        tableVariants.column({ stickyHeader }),
        className,
      )}
      style={{
        ...(stickyHeader && {
          clipPath: "polygon(0 0, 100% 0, 100% 130%, 0 130%)",
        }),
        ...getCellStyle({ align, cellWidth }),
      }}
      {...props}
    />
  );
};

export const TableColumn = autoRef(TableColumnInternal);

/* ---------------------------------- Cell ---------------------------------- */

export type TableCellProps = React.ComponentPropsWithRef<typeof RaCell> &
  CellProps;

export const TableCell = autoRef(
  ({ className, cellWidth, align, ...props }: TableCellProps) => {
    const { bodySize } = useTableContext();

    return (
      <RaCell
        className={(values) =>
          cn(
            tableVariants.cell({ size: bodySize }),
            withRenderProps(className)(values),
          )
        }
        style={getCellStyle({ cellWidth, align })}
        {...props}
      />
    );
  },
);

/* ----------------------------------- Row ---------------------------------- */

export interface TableRowProps<TData extends object> extends RowProps<TData> {
  ref?: React.ComponentPropsWithRef<typeof RaRow>["ref"];
}

const TableRowInternal = <TData extends object>({
  className,
  ...props
}: TableRowProps<TData>) => {
  return <RaRow className={cn(tableVariants.row(), className)} {...props} />;
};

export const TableRow = autoRef(TableRowInternal);

/* ------------------------------- CellActions ------------------------------ */

export type TableCellActionsProps = React.ComponentPropsWithRef<"div">;

export const TableCellActions = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: React.ReactNode;
}) => {
  return <div className={cn("flex justify-end", className)}>{children}</div>;
};

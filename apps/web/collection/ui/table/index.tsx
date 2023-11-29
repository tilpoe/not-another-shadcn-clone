"use client";

import { createContext, useContext, useMemo } from "react";
import { cva } from "cva";
import {
  Cell as RaCell,
  Column as RaColumn,
  Row as RaRow,
  Table as RaTable,
  TableHeader as RaTableHeader,
  TableBody,
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
  width?: number;
  align?: "left" | "center" | "right";
}

const getCellStyle = ({ width, align }: CellProps) => {
  return {
    textAlign: align,
    width: width ? `${width}%` : undefined,
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
    base: "[&_tr:last-child]:border-0",
  }),
  row: cva({
    base: "border-b transition-colors s-focus:outline-none",
  }),
  column: cva({
    base: "text-left align-middle font-medium text-muted-foreground [&>[role=checkbox]]:translate-y-[2px] s-focus:outline-none",
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

export type TBodyProps = React.ComponentPropsWithRef<typeof TableBody>;

export const TBody = autoRef(({ className, ...props }: TBodyProps) => {
  return (
    <TableBody className={cn(tableVariants.body(), className)} {...props} />
  );
});

/* ---------------------------------- Head ---------------------------------- */

export type THeadProps = React.ComponentPropsWithRef<typeof RaTableHeader>;

export const THead = autoRef(({ className, ...props }: THeadProps) => {
  return (
    <RaTableHeader
      className={cn(tableVariants.header(), className)}
      {...props}
    />
  );
});

/* --------------------------------- Column --------------------------------- */

export type ColumnProps = React.ComponentPropsWithRef<typeof RaColumn> &
  CellProps & {
    isResizer?: boolean;
  };

export const Column = autoRef(
  ({ className, width, align, ...props }: ColumnProps) => {
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
          ...getCellStyle({ align, width }),
        }}
        {...props}
      />
    );
  },
);

/* ---------------------------------- Cell ---------------------------------- */

export type TableCellProps = React.ComponentPropsWithRef<typeof RaCell> &
  CellProps;

export const Cell = autoRef(
  ({ className, width, align, ...props }: TableCellProps) => {
    const { bodySize } = useTableContext();

    return (
      <RaCell
        className={(values) =>
          cn(
            tableVariants.cell({ size: bodySize }),
            withRenderProps(className)(values),
          )
        }
        style={getCellStyle({ width, align })}
        {...props}
      />
    );
  },
);

/* ----------------------------------- Row ---------------------------------- */

export type TableRowProps = React.ComponentPropsWithRef<typeof RaRow>;

export const Row = autoRef(({ className, ...props }: TableRowProps) => {
  return <RaRow className={cn(tableVariants.row(), className)} {...props} />;
});

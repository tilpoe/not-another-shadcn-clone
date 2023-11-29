"use client";

import { Command as CommandPrimitive } from "cmdk";
import { cva } from "cva";

import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const commandVariants = {
  root: cva({
    base: "flex h-full w-full flex-col overflow-hidden rounded-md bg-white",
  }),
  input: {
    wrapper: cva({
      base: "flex items-center border-b px-3",
    }),
    input: cva({
      base: "placeholder:text-foreground-muted flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
    }),
  },
  list: cva({
    base: "max-h-[300px] overflow-y-auto overflow-x-hidden",
  }),
  empty: cva({
    base: "py-4 text-center text-sm",
  }),
  group: cva({
    base: cn(
      "overflow-hidden p-1 text-foreground",
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
    ),
  }),
  item: cva({
    base: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none ",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      "aria-selected:bg-accent aria-selected:text-accent-foreground",
      "data-[checked=true]:bg-accent data-[checked=true]:text-accent-foreground",
    ),
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

export type CommandProps = React.ComponentPropsWithRef<typeof CommandPrimitive>;

export const Command = autoRef(({ className, ...props }: CommandProps) => {
  return (
    <CommandPrimitive
      className={commandVariants.root({ className })}
      {...props}
    />
  );
});

/* ---------------------------------- Input --------------------------------- */

export type CommandInputProps = React.ComponentPropsWithRef<
  typeof CommandPrimitive.Input
> & {
  classNames?: {
    wrapper?: string;
    input?: string;
  };
};

export const CommandInput = autoRef(
  ({ className, classNames, ...props }: CommandInputProps) => {
    return (
      <div
        className={commandVariants.input.wrapper({
          className: cn(className, classNames?.wrapper),
        })}
        // eslint-disable-next-line react/no-unknown-property
        cmdk-input-wrapper=""
      >
        {/* <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" /> */}
        <CommandPrimitive.Input
          className={commandVariants.input.input({
            className: classNames?.input,
          })}
          {...props}
        />
      </div>
    );
  },
);

/* ---------------------------------- List ---------------------------------- */

export type CommandListProps = React.ComponentPropsWithRef<
  typeof CommandPrimitive.List
>;

export const CommandList = autoRef(
  ({ className, ...props }: CommandListProps) => {
    return (
      <CommandPrimitive.List
        className={commandVariants.list({ className })}
        {...props}
      />
    );
  },
);

/* ---------------------------------- Empty --------------------------------- */

export type CommandEmptyProps = React.ComponentPropsWithRef<
  typeof CommandPrimitive.Empty
>;

export const CommandEmpty = autoRef(
  ({ className, ...props }: CommandEmptyProps) => {
    return (
      <CommandPrimitive.Empty
        className={commandVariants.empty({ className })}
        {...props}
      />
    );
  },
);

/* ---------------------------------- Group --------------------------------- */

export type CommandGroupProps = React.ComponentPropsWithRef<
  typeof CommandPrimitive.Group
>;

export const CommandGroup = autoRef(
  ({ className, ...props }: CommandGroupProps) => {
    return (
      <CommandPrimitive.Group
        className={commandVariants.group({ className })}
        {...props}
      />
    );
  },
);

/* ---------------------------------- Item ---------------------------------- */

export type CommandItemProps = React.ComponentPropsWithRef<
  typeof CommandPrimitive.Item
>;

export const CommandItem = autoRef(
  ({ className, ...props }: CommandItemProps) => {
    return (
      <CommandPrimitive.Item
        className={commandVariants.item({ className })}
        {...props}
      />
    );
  },
);

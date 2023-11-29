"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { VariantProps } from "cva";
import { cva } from "cva";
import { Check, ChevronRight, Circle } from "lucide-react";

import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const dropdownMenuVariants = {
  content: cva({
    base: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    ),
  }),
  item: cva({
    base: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    ),
    variants: {
      inset: {
        true: "pl-8",
        false: "",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }),
  checkboxItem: cva({
    base: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    ),
  }),
  radioItem: cva({
    base: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    ),
  }),
  label: cva({
    base: "px-2 py-1.5 text-sm font-semibold",
    variants: {
      inset: {
        true: "pl-8",
        false: "",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }),
  separator: cva({
    base: "-mx-1 my-1 h-px bg-muted",
  }),
  shortcut: cva({
    base: "ml-auto text-xs tracking-widest opacity-60",
  }),
  subTrigger: cva({
    base: "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
    variants: {
      inset: {
        true: "pl-8",
        false: "",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }),
  subContent: cva({
    base: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    ),
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

export const DropdownMenu = DropdownMenuPrimitive.Root;

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/* ------------------------------- SubTrigger ------------------------------- */

export type DropdownMenuSubTriggerProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.SubTrigger
> &
  VariantProps<typeof dropdownMenuVariants.subTrigger>;

export const DropdownMenuSubTrigger = autoRef(
  ({ className, inset, children, ...props }: DropdownMenuSubTriggerProps) => {
    return (
      <DropdownMenuPrimitive.SubTrigger
        className={cn(dropdownMenuVariants.subTrigger({ inset }), className)}
        {...props}
      >
        {children}
        <ChevronRight className="ml-auto h-4 w-4" />
      </DropdownMenuPrimitive.SubTrigger>
    );
  },
);

/* ------------------------------- SubContent ------------------------------- */

export type DropdownMenuSubContentProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.SubContent
>;

export const DropdownMenuSubContent = autoRef(
  ({ className, ...props }: DropdownMenuSubContentProps) => {
    return (
      <DropdownMenuPrimitive.SubContent
        className={cn(dropdownMenuVariants.subContent(), className)}
        {...props}
      />
    );
  },
);

/* --------------------------------- Content -------------------------------- */

export type DropdownMenuContentProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Content
>;

export const DropdownMenuContent = autoRef(
  ({ className, sideOffset = 4, ...props }: DropdownMenuContentProps) => {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          sideOffset={sideOffset}
          className={cn(dropdownMenuVariants.content(), className)}
          {...props}
        />
      </DropdownMenuPrimitive.Portal>
    );
  },
);

/* ---------------------------------- Item ---------------------------------- */

export type DropdownMenuItemProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Item
> &
  VariantProps<typeof dropdownMenuVariants.item>;

export const DropdownMenuItem = autoRef(
  ({ className, inset, ...props }: DropdownMenuItemProps) => {
    return (
      <DropdownMenuPrimitive.Item
        className={cn(dropdownMenuVariants.item({ inset }), className)}
        {...props}
      />
    );
  },
);

/* ------------------------------ Checkbox Item ----------------------------- */

export type DropdownMenuCheckboxItemProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;

export const DropdownMenuCheckboxItem = autoRef(
  ({
    className,
    children,
    checked,
    ...props
  }: DropdownMenuCheckboxItemProps) => {
    return (
      <DropdownMenuPrimitive.CheckboxItem
        className={cn(dropdownMenuVariants.checkboxItem(), className)}
        checked={checked}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <Check className="h-4 w-4" />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitive.CheckboxItem>
    );
  },
);

/* ------------------------------- Radio Item ------------------------------- */

export type DropdownMenuRadioItem = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.RadioItem
>;

export const DropdownMenuRadioItem = autoRef(
  ({ className, children, ...props }: DropdownMenuRadioItem) => {
    return (
      <DropdownMenuPrimitive.RadioItem
        className={cn(dropdownMenuVariants.radioItem(), className)}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <Circle className="h-2 w-2 fill-current" />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitive.RadioItem>
    );
  },
);

/* --------------------------------- Label ---------------------------------- */

export type DropdownMenuLabelProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Label
> &
  VariantProps<typeof dropdownMenuVariants.label>;

export const DropdownMenuLabel = autoRef(
  ({ className, inset, ...props }: DropdownMenuLabelProps) => {
    return (
      <DropdownMenuPrimitive.Label
        className={cn(dropdownMenuVariants.label({ inset }), className)}
        {...props}
      />
    );
  },
);

/* -------------------------------- Separator ------------------------------- */

export type DropdownMenuSeparatorProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitive.Separator
>;

export const DropdownMenuSeparator = autoRef(
  ({ className, ...props }: DropdownMenuSeparatorProps) => {
    return (
      <DropdownMenuPrimitive.Separator
        className={cn(dropdownMenuVariants.separator(), className)}
        {...props}
      />
    );
  },
);

/* -------------------------------- Shortcut -------------------------------- */

export type DropdownMenuShortcutProps = React.ComponentPropsWithRef<"span">;

export const DropdownMenuShortcut = ({
  className,
  ...props
}: DropdownMenuShortcutProps) => {
  return (
    <span
      className={cn(dropdownMenuVariants.shortcut(), className)}
      {...props}
    />
  );
};

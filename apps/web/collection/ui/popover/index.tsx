"use client";

import { cva } from "cva";
import type { PopoverRenderProps } from "react-aria-components";
import {
  Dialog,
  DialogTrigger,
  Heading,
  Popover as RaPopover,
} from "react-aria-components";

import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const popoverVariants = {
  root: cva({
    base: cn(
      "z-50 w-72 rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
      "s-placement-top:slide-in-from-bottom-2",
      "s-placement-bottom:slide-in-from-top-2",
      "s-placement-left:slide-in-from-right-2",
      "s-placement-right:slide-in-from-left-2",
      "s-entering:animate-in s-entering:fade-in-0 s-entering:zoom-in-95",
      "s-exiting:animate-out s-exiting:fade-out-0 s-exiting:zoom-out-95",
    ),
  }),
  header: cva({
    base: "space-y-2 px-4 pt-4",
  }),
  title: cva({
    base: "font-medium leading-none",
  }),
  description: cva({
    base: "text-sm text-muted-foreground",
  }),
  content: cva({
    base: "p-4",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Trigger -------------------------------- */

export const PopoverTrigger = DialogTrigger;

/* ---------------------------------- Root ---------------------------------- */

export type PopoverProps = Omit<
  React.ComponentPropsWithRef<typeof RaPopover>,
  "children"
> & {
  children?:
    | React.ReactNode
    | ((values: PopoverRenderProps & { close: () => void }) => React.ReactNode);
};

export const Popover = autoRef(
  ({ className, children, ...props }: PopoverProps) => {
    return (
      <RaPopover className={cn(popoverVariants.root(), className)} {...props}>
        {(popoverValues) => (
          <Dialog className="focus-within:outline-none">
            {({ close }) => (
              <>{withRenderProps(children)({ ...popoverValues, close })}</>
            )}
          </Dialog>
        )}
      </RaPopover>
    );
  },
);

/* --------------------------------- Header --------------------------------- */

export type PopoverHeaderProps = React.ComponentPropsWithRef<"div">;

export const PopoverHeader = autoRef(
  ({ className, ...props }: PopoverHeaderProps) => {
    return (
      <div className={cn(popoverVariants.header(), className)} {...props} />
    );
  },
);

/* ---------------------------------- Title --------------------------------- */

export type PopoverTitleProps = React.ComponentPropsWithRef<typeof Heading>;

export const PopoverTitle = autoRef(
  ({ className, ...props }: PopoverTitleProps) => {
    return (
      <Heading
        slot="title"
        className={cn(popoverVariants.title(), className)}
        {...props}
      />
    );
  },
);

/* ------------------------------- Description ------------------------------ */

export type PopoverDescriptionProps = React.ComponentPropsWithRef<"p">;

export const PopoverDescription = autoRef(
  ({ className, ...props }: PopoverDescriptionProps) => {
    return (
      <p className={cn(popoverVariants.description(), className)} {...props} />
    );
  },
);

/* --------------------------------- Content -------------------------------- */

export type PopoverContentProps = React.ComponentPropsWithRef<"div">;

export const PopoverContent = autoRef(
  ({ className, ...props }: PopoverContentProps) => {
    return (
      <div className={cn(popoverVariants.content(), className)} {...props} />
    );
  },
);

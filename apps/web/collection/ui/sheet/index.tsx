"use client";

import type { VariantProps } from "cva";
import { cva } from "cva";
import type { ModalRenderProps } from "react-aria-components";
import {
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";

import { dialogVariants } from "@/collection/ui/dialog-v2";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const sheetVariants = {
  root: cva({
    base: cn(
      "tp-sheet-base",
      "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
      "s-entering:animate-in s-exiting:animate-out s-entering:duration-300 s-exiting:duration-500",
    ),
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b s-exiting:slide-out-to-top s-entering:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t s-exiting:slide-out-to-bottom s-entering:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r s-exiting:slide-out-to-left s-entering:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l s-exiting:slide-out-to-right s-entering:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }),
  overlay: cva({
    base: dialogVariants.overlay(),
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Trigger -------------------------------- */

export const SheetTrigger = DialogTrigger;

/* ---------------------------------- Root ---------------------------------- */

export interface SheetProps
  extends Omit<React.ComponentPropsWithRef<typeof Modal>, "children">,
    VariantProps<typeof sheetVariants.root> {
  children?:
    | React.ReactNode
    | ((values: ModalRenderProps & { close: () => void }) => React.ReactNode);
  blurBackground?: boolean;
}

export const Sheet = autoRef(
  ({
    className,
    children,
    isDismissable = true,
    side,
    ...props
  }: SheetProps) => {
    return (
      <>
        <ModalOverlay className={sheetVariants.overlay()} />
        <Modal
          isDismissable={isDismissable}
          className={cn(sheetVariants.root({ side }), className)}
          {...props}
        >
          {(modalValues) => (
            <Dialog className="relative outline-none">
              {({ close }) => (
                <>{withRenderProps(children)({ ...modalValues, close })}</>
              )}
            </Dialog>
          )}
        </Modal>
      </>
    );
  },
);

/* --------------------------------- Header --------------------------------- */

export type SheetHeaderProps = React.ComponentPropsWithRef<"div">;

export const SheetHeader = autoRef(
  ({ className, ...props }: SheetHeaderProps) => (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  ),
);

/* --------------------------------- Footer --------------------------------- */

export type SheetFooterProps = React.ComponentPropsWithRef<"div">;

export const SheetFooter = autoRef(
  ({ className, ...props }: SheetFooterProps) => (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  ),
);

/* ---------------------------------- Title --------------------------------- */

export type SheetTitleProps = React.ComponentPropsWithRef<typeof Heading>;

export const SheetTitle = autoRef(
  ({ className, ...props }: SheetTitleProps) => (
    <Heading
      slot="title"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  ),
);

/* ------------------------------- Description ------------------------------- */

export type SheetDescriptionProps = React.ComponentPropsWithRef<"p">;

export const SheetDescription = autoRef(
  ({ className, ...props }: SheetDescriptionProps) => (
    <p
      slot="description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);

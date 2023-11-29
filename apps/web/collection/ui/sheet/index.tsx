"use client";

import type { VariantProps } from "cva";
import { cva } from "cva";
import type { ModalRenderProps } from "react-aria-components";
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";

import { dialogVariants } from "@/collection/ui/dialog";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const sheetVariants = {
  root: cva({
    base: cn(
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

export type SheetProps = Omit<
  React.ComponentPropsWithRef<typeof Modal>,
  "children"
> &
  VariantProps<typeof dialogVariants.root> & {
    children?:
      | React.ReactNode
      | ((values: ModalRenderProps & { close: () => void }) => React.ReactNode);
  };

export const Sheet = autoRef(
  ({ className, children, isDismissable = true, ...props }: SheetProps) => {
    return (
      <>
        <ModalOverlay className={sheetVariants.overlay()} />
        <Modal
          isDismissable={isDismissable}
          className={cn(sheetVariants.root(), className)}
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

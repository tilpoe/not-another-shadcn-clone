"use client";

import type { JSXElementConstructor, ReactElement } from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "cva";
import { cva } from "cva";
import { AlertTriangle, HelpCircle, Info, X } from "lucide-react";
import type { ModalRenderProps } from "react-aria-components";
import {
  Heading,
  Modal,
  ModalOverlay,
  Dialog as RaDialog,
  DialogTrigger as RaDialogTrigger,
} from "react-aria-components";

import { Button, ButtonIcon } from "@/collection/ui/button";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const dialogVariants = {
  overlay: cva({
    base: cn(
      "fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur",
      "s-entering:animate-in s-entering:fade-in s-entering:duration-300 s-entering:ease-out",
      "s-exiting:animate-out s-exiting:fade-out s-exiting:duration-200 s-exiting:ease-in",
    ),
  }),
  root: cva({
    base: cn(
      "w-full overflow-hidden rounded-lg bg-white text-left align-middle shadow-lg",
      "sm:max-h-[90%]",
      "s-entering:animate-in s-entering:zoom-in-95 s-entering:duration-300",
      "s-exiting:animate-out s-exiting:zoom-out-95 s-exiting:duration-200",
    ),
    variants: {
      size: {
        default: "sm:max-w-lg",
        lg: "sm:max-w-3xl",
        xl: "sm:max-w-6xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }),
  header: cva({
    base: cn("flex flex-col space-y-1.5 text-center sm:text-left"),
  }),
  title: cva({
    base: cn("px-6 pt-6 text-lg font-semibold leading-none tracking-tight"),
  }),
  description: cva({
    base: "px-6 text-sm text-muted-foreground",
  }),
  body: cva({
    base: cn(
      "flex grow flex-col gap-4 overflow-y-auto px-6 py-4 text-muted-foreground",
    ),
  }),
  footer: cva({
    base: cn(
      "flex flex-col-reverse gap-2 px-6 pb-6 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2",
    ),
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Trigger -------------------------------- */

export const DialogTrigger = RaDialogTrigger;

/* ---------------------------------- Root ---------------------------------- */

export type DialogProps = Omit<
  React.ComponentPropsWithRef<typeof Modal>,
  "children"
> &
  VariantProps<typeof dialogVariants.root> & {
    children?:
      | React.ReactNode
      | ((values: ModalRenderProps & { close: () => void }) => React.ReactNode);
  } & {
    isAlert?: boolean;
    icon?:
      | "alert"
      | "info"
      | "question"
      | ReactElement<any, string | JSXElementConstructor<any>>;
  };

const CloseButton = ({ close }: { close: () => void }) => {
  return (
    <Button
      icon
      variant="ghost"
      className="absolute right-4 top-4"
      onPress={close}
    >
      <ButtonIcon icon={<X />} />
    </Button>
  );
};

export const Dialog = autoRef(
  ({
    className,
    children,
    size,
    isAlert,
    icon,
    isDismissable = true,
    ...props
  }: DialogProps) => {
    let dialogIcon: React.ReactNode;
    switch (icon) {
      case "alert": {
        dialogIcon = <AlertTriangle />;
        break;
      }
      case "info": {
        dialogIcon = <Info />;
        break;
      }
      case "question": {
        dialogIcon = <HelpCircle />;
        break;
      }
      default:
        dialogIcon = icon;
    }

    return (
      <ModalOverlay
        className={dialogVariants.overlay()}
        isDismissable={isDismissable}
      >
        <Modal
          className={cn(dialogVariants.root({ size }), className)}
          {...props}
        >
          {(modalValues) => (
            <RaDialog
              role={isAlert ? "alertdialog" : "dialog"}
              className="relative outline-none"
            >
              {({ close }) => (
                <>
                  {icon ? (
                    <Slot className="absolute right-6 top-6 h-6 w-6 opacity-30">
                      {dialogIcon}
                    </Slot>
                  ) : (
                    <CloseButton close={close} />
                  )}
                  {withRenderProps(children)({ ...modalValues, close })}
                </>
              )}
            </RaDialog>
          )}
        </Modal>
      </ModalOverlay>
    );
  },
);

/* --------------------------------- Header --------------------------------- */

export type DialogHeaderProps = React.ComponentPropsWithRef<"div">;

export const DialogHeader = autoRef(
  ({ className, ...props }: DialogHeaderProps) => {
    return (
      <div className={cn(dialogVariants.header(), className)} {...props} />
    );
  },
);

/* ---------------------------------- Title --------------------------------- */

export type DialogTitleProps = React.ComponentPropsWithRef<typeof Heading>;

export const DialogTitle = autoRef(
  ({ className, ...props }: DialogTitleProps) => {
    return (
      <Heading
        slot="title"
        className={cn(dialogVariants.title(), className)}
        {...props}
      />
    );
  },
);

/* ------------------------------- Description ------------------------------ */

export type DialogDescriptionProps = React.ComponentPropsWithRef<"p">;

export const DialogDescription = autoRef(
  ({ className, ...props }: DialogDescriptionProps) => {
    return (
      <p className={cn(dialogVariants.description(), className)} {...props} />
    );
  },
);

/* ---------------------------------- Body ---------------------------------- */

export type DialogBodyProps = React.ComponentPropsWithRef<"div">;

export const DialogBody = autoRef(
  ({ className, ...props }: DialogBodyProps) => {
    return <div className={cn(dialogVariants.body(), className)} {...props} />;
  },
);

/* --------------------------------- Footer --------------------------------- */

export type DialogFooterProps = React.ComponentPropsWithRef<"div">;

export const DialogFooter = autoRef(
  ({ className, ...props }: DialogFooterProps) => {
    return (
      <div className={cn(dialogVariants.footer(), className)} {...props} />
    );
  },
);

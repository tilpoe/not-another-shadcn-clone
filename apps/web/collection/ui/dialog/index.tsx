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
      "fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur",
      "s-entering:animate-in s-entering:fade-in s-entering:duration-300 s-entering:ease-out",
      "s-exiting:animate-out s-exiting:fade-out s-exiting:duration-200 s-exiting:ease-in",
    ),
  }),
  root: cva({
    base: cn(
      "w-full overflow-hidden rounded-lg text-left align-middle shadow-lg",
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
  rootInner: cva({
    base: cn("relative outline-none flex flex-col h-full bg-white"),
  }),
  header: cva({
    base: cn("flex flex-col space-y-1.5 text-center sm:text-left shrink-0"),
  }),
  title: cva({
    base: cn("px-6 pt-6 text-lg font-semibold leading-none tracking-tight"),
  }),
  description: cva({
    base: "px-6 text-sm text-muted-foreground",
  }),
  body: cva({
    base: cn("flex flex-col overflow-y-auto px-6 py-6"),
    variants: {
      isDescription: {
        true: "text-muted-foreground",
        false: "",
      },
    },
    defaultVariants: {
      isDescription: false,
    },
  }),
  footer: cva({
    base: cn(
      "flex flex-col-reverse gap-2 px-6 pb-6 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2 shrink-0",
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
    ["aria-label"]?: string;
    classNames?: {
      icon?: string;
    };
  };

export const Dialog = autoRef(
  ({
    className,
    children,
    size,
    isAlert,
    icon,
    "aria-label": ariaLabel,
    isDismissable = true,
    classNames,
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
        {...props}
        className={dialogVariants.overlay()}
        isDismissable={isDismissable}
      >
        <Modal
          className={cn(dialogVariants.root({ size }), className)}
          {...props}
        >
          {(modalValues) => (
            <RaDialog
              aria-label={ariaLabel}
              role={isAlert ? "alertdialog" : "dialog"}
              className={cn(dialogVariants.rootInner())}
            >
              {({ close }) => (
                <>
                  {icon ? (
                    <Slot className="absolute right-6 top-6 h-6 w-6 opacity-30">
                      {dialogIcon}
                    </Slot>
                  ) : (
                    <Button
                      icon
                      variant="ghost"
                      className={cn("absolute right-4 top-4", classNames?.icon)}
                      onPress={close}
                    >
                      <ButtonIcon icon={<X />} />
                    </Button>
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

/* --------------------------------- Overlay -------------------------------- */

export type DialogOverlayProps = React.ComponentPropsWithRef<
  typeof ModalOverlay
>;

export const DialogOverlay = autoRef(
  ({ className, ...props }: DialogOverlayProps) => {
    return (
      <ModalOverlay
        className={cn(dialogVariants.overlay(), className)}
        {...props}
      />
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

export type DialogBodyProps = React.ComponentPropsWithRef<"div"> &
  VariantProps<typeof dialogVariants.body>;

export const DialogBody = autoRef(
  ({ className, isDescription, ...props }: DialogBodyProps) => {
    return (
      <div
        className={cn(dialogVariants.body({ isDescription }), className)}
        {...props}
      />
    );
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

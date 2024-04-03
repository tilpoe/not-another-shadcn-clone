import { XIcon } from "lucide-react";
import type { ModalRenderProps } from "react-aria-components";
import {
  Heading,
  Modal,
  ModalOverlay,
  Dialog as RACDialog,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import type { ButtonProps } from "@/collection/ui/button";
import { Button } from "@/collection/ui/button";
import { autoRef, cn, composeClassName, withRenderProps } from "@/lib/ui";

/* ---------------------------------- Root ---------------------------------- */

export const dialogOverlayVariants = tv({
  base: "fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur",
  variants: {
    isEntering: {
      true: "animate-in fade-in duration-300 ease-out",
    },
    isExiting: {
      true: "animate-out fade-out duration-200 ease-in",
    },
  },
});

const dialogRootVariants = tv({
  base: cn(
    "w-full overflow-hidden rounded-lg text-left align-middle shadow-lg",
    "sm:max-h-[90%]",
  ),
  variants: {
    isEntering: {
      true: "animate-in zoom-in-95 duration-300",
    },
    isExiting: {
      true: "animate-out zoom-out-95 duration-200",
    },
    size: {
      default: "sm:max-w-lg",
      lg: "sm:max-w-3xl",
      xl: "sm:max-w-6xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type DialogProps = Omit<
  React.ComponentPropsWithRef<typeof Modal>,
  "children" | "className"
> &
  VariantProps<typeof dialogRootVariants> & {
    children?:
      | React.ReactNode
      | ((values: ModalRenderProps & { close: () => void }) => React.ReactNode);
    classNames?: {
      overlay?: string | ((values: ModalRenderProps) => string);
      root?: string | ((values: ModalRenderProps) => string);
      inner?: string;
      closeButton?: string;
    };
    isAlert?: boolean;
  };

export const Dialog = autoRef(
  ({
    children,
    isAlert,
    classNames,
    size,
    isDismissable = true,
    ...props
  }: DialogProps) => {
    return (
      <ModalOverlay
        {...props}
        className={composeClassName(
          classNames?.overlay,
          (className, renderProps) =>
            dialogOverlayVariants({ ...renderProps, className }),
        )}
        isDismissable={isDismissable}
      >
        <Modal
          className={composeClassName(
            classNames?.root,
            (className, renderProps) =>
              dialogRootVariants({ ...renderProps, size, className }),
          )}
          {...props}
        >
          {(modalValues) => (
            <RACDialog
              role={isAlert ? "alertdialog" : "dialog"}
              className={cn(
                "relative flex h-full flex-col bg-white outline-none",
                classNames?.inner,
              )}
            >
              {({ close }) => (
                <>
                  <Button
                    variant="ghost/secondary"
                    className={cn(
                      "absolute right-4 top-4",
                      classNames?.closeButton,
                    )}
                    onPress={close}
                    icon={<XIcon />}
                  />
                  {withRenderProps(children)({ ...modalValues, close })}
                </>
              )}
            </RACDialog>
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
      <div
        className={cn(
          "flex shrink-0 flex-col space-y-1.5 text-center sm:text-left",
          className,
        )}
        {...props}
      />
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
        className={cn(
          "px-6 pt-6 text-lg font-semibold tracking-tight",
          className,
        )}
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
      <p
        className={cn("px-6 text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

/* ---------------------------------- Body ---------------------------------- */

const dialogBodyVariants = tv({
  base: "flex flex-col overflow-y-auto px-6 py-6",
  variants: {
    isDescription: {
      true: "text-muted-foreground",
      false: "",
    },
  },
  defaultVariants: {
    isDescription: false,
  },
});

export type DialogBodyProps = React.ComponentPropsWithRef<"div"> &
  VariantProps<typeof dialogBodyVariants>;

export const DialogBody = autoRef(
  ({ className, isDescription, ...props }: DialogBodyProps) => {
    return (
      <div
        className={cn(dialogBodyVariants({ isDescription }), className)}
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
      <div
        className={cn(
          "flex shrink-0 flex-col-reverse gap-2 px-6 pb-6 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2",
          className,
        )}
        {...props}
      />
    );
  },
);

/* ---------------------------- CloseDialogButton --------------------------- */

export type CloseDialogButtonProps = ButtonProps & {
  close: () => void;
};

export const CloseDialogButton = ({
  close,
  children,
  onPress,
  variant,
  ...props
}: CloseDialogButtonProps) => {
  return (
    <Button
      variant={variant ?? "outline/secondary"}
      onPress={(e) => {
        onPress?.(e);
        close();
      }}
      {...props}
    >
      {children ?? "Abbrechen"}
    </Button>
  );
};

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "cva";
import { cva } from "cva";
import { Loader2 } from "lucide-react";
import { useButton } from "react-aria";
import type { Button as RaButton } from "react-aria-components";
import {
  ButtonContext as RaButtonContext,
  useContextProps,
} from "react-aria-components";

import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

interface ButtonContextType {
  isLoading?: boolean;
  iconOnly?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
}

const ButtonContext = createContext<ButtonContextType | null>(null);

function useButtonContext() {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error("useButtonContext must be used within a <Button/>");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

export const buttonVariants = cva({
  base: cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  variants: {
    variant: {
      default: "",
      secondary: "",
      outline: "border bg-background",
      ghost: "",
    },
    intent: {
      default: "",
      destructive: "",
    },
    size: {
      xs: "h-8 px-2 text-xs",
      sm: "h-9 px-3",
      default: "h-10 px-3",
      lg: "h-11 px-5",
    },
    icon: {
      true: "",
      false: "",
    },
    width: {
      default: "inline-flex",
      full: "flex w-full",
    },
  },
  compoundVariants: [
    // default variant
    {
      variant: "default",
      intent: "default",
      className: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    {
      variant: "default",
      intent: "destructive",
      className:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    // secondary variant
    {
      variant: "secondary",
      intent: "default",
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    },
    // outline variant
    {
      variant: "outline",
      intent: "default",
      className: "border-input hover:bg-accent",
    },
    {
      variant: "outline",
      intent: "destructive",
      className: "border-destructive text-destructive hover:bg-destructive/5",
    },
    // ghost variant
    {
      variant: "ghost",
      intent: "default",
      className: "hover:bg-accent",
    },
    {
      variant: "ghost",
      intent: "destructive",
      className: "text-destructive hover:bg-destructive/10",
    },
    // icon only
    {
      size: "sm",
      icon: true,
      className: "h-9 w-9 p-2",
    },
    {
      size: "default",
      icon: true,
      className: "h-10 w-10 px-0",
    },
    {
      size: "lg",
      icon: true,
      className: "h-11 w-11 px-0",
    },
  ],
  defaultVariants: {
    variant: "default",
    intent: "default",
    size: "default",
    width: "default",
    icon: false,
  },
});

export interface ButtonProps
  extends Omit<React.ComponentPropsWithRef<typeof RaButton>, "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  isLoading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
}

export const Button = autoRef(({ ref, ...props }: ButtonProps) => {
  [props, ref] = useContextProps(props, ref!, RaButtonContext);

  const {
    children,
    className,
    width,
    variant,
    size,
    icon,
    intent,
    isLoading,
    isDisabled,
    type,
  } = props;
  const buttonContextValues = useMemo(
    () => ({
      isLoading,
      iconOnly: icon,
      size,
    }),
    [isLoading, icon, size],
  );

  const hasIcon = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === ButtonIcon,
  );

  // have to use react-aria's useButton hook because of the way it handles press events
  // if any third party library injects "onClick" or "onPointerDown" props (e.g. radix)
  // it would not be propagated to the button
  const { onPointerDown, onClick, ...sanitizedProps } = props;
  const { buttonProps } = useButton(
    sanitizedProps,
    ref as React.RefObject<Element>,
  );

  const { onPointerDown: ariaOnPointerDown, onClick: ariaOnClick } =
    buttonProps;

  return (
    <ButtonContext.Provider value={buttonContextValues}>
      <button
        {...buttonProps}
        className={cn(
          buttonVariants({
            variant,
            size,
            width,
            icon,
            intent,
          }),
          className,
        )}
        onPointerDown={(e) => {
          if (onPointerDown !== undefined) {
            onPointerDown(e);
          }

          ariaOnPointerDown?.(e);
        }}
        onClick={(e) => {
          if (onClick !== undefined) {
            onClick(e);
          }

          ariaOnClick?.(e);
        }}
        disabled={isLoading || isDisabled}
        type={props.form !== undefined ? "submit" : type}
        ref={ref}
      >
        <>
          {!hasIcon && <ButtonLoader />}
          {children}
        </>
      </button>
    </ButtonContext.Provider>
  );
});

/* ---------------------------------- Icon ---------------------------------- */

export const ButtonIcon = ({
  icon,
  className,
  only,
}: {
  icon?: React.ReactNode;
  className?: string;
  only?: boolean;
}) => {
  const { isLoading, iconOnly } = useButtonContext();
  const isIconOnly = iconOnly || only;

  if (isLoading) {
    return (
      <Loader2
        className={cn("h-4 w-4 animate-spin", !isIconOnly && "mr-2", className)}
      />
    );
  }

  return (
    <Slot className={cn("h-4 w-4", !isIconOnly && "mr-2", className)}>
      {icon}
    </Slot>
  );
};

/* --------------------------------- Loader --------------------------------- */

export const ButtonLoader = ({ show }: { show?: boolean }) => {
  const { isLoading } = useButtonContext();

  if (isLoading ?? show) {
    return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  }

  return null;
};

/* ------------------------------- CloseDialog ------------------------------ */

export type CloseDialogButtonProps = Omit<
  React.ComponentPropsWithRef<typeof Button>,
  "onPress"
> & {
  close: () => void;
};

export const CloseDialogButton = ({
  close,
  children,
  variant,
  ...props
}: CloseDialogButtonProps) => {
  return (
    <Button {...props} onPress={close} variant={variant ?? "outline"}>
      {children ?? "Abbrechen"}
    </Button>
  );
};

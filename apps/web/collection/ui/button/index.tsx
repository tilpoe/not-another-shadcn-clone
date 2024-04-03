"use client";

import { Slot } from "@radix-ui/react-slot";
import { Loader2Icon } from "lucide-react";
import { Button as RACButton } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { autoRef, cn, composeClassName, focusRing } from "@/lib/ui";

/* -------------------------------------------------------------------------- */
/*                                   Button                                   */
/* -------------------------------------------------------------------------- */
export const buttonVariants = tv({
  extend: focusRing,
  base: cn(
    "w-fit inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors gap-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  variants: {
    variant: {
      default: "",
      outline: "border",
      ghost: "",
    },
    intent: {
      primary: "",
      secondary: "",
      destructive: "",
    },
    iconOnly: {
      true: "!p-0",
    },
    size: {
      default: "h-10 px-3",
      sm: "h-9 px-2.5",
      lg: "h-11 px-3.5",
    },
  },
  defaultVariants: {
    variant: "default",
    intent: "primary",
    iconOnly: false,
    size: "default",
  },
  compoundVariants: [
    // icon only sizes
    {
      iconOnly: true,
      size: "default",
      className: "w-10",
    },
    {
      iconOnly: true,
      size: "sm",
      className: "w-9",
    },
    {
      iconOnly: true,
      size: "lg",
      className: "w-11",
    },
    // default variant
    {
      variant: "default",
      intent: "primary",
      className: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    {
      variant: "default",
      intent: "secondary",
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    },
    {
      variant: "default",
      intent: "destructive",
      className:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    // outline variant
    {
      variant: "outline",
      intent: "primary",
      className: "border-primary text-primary hover:bg-primary/10",
    },
    {
      variant: "outline",
      intent: "secondary",
      className: "border text-secondary-foreground hover:bg-secondary",
    },
    {
      variant: "outline",
      intent: "destructive",
      className: "border-destructive text-destructive hover:bg-destructive/10",
    },
    // ghost variant
    {
      variant: "ghost",
      intent: "primary",
      className: "text-primary hover:bg-primary/10",
    },
    {
      variant: "ghost",
      intent: "secondary",
      className: "text-secondary-foreground hover:bg-secondary",
    },
    {
      variant: "ghost",
      intent: "destructive",
      className: "text-destructive hover:bg-destructive/10",
    },
  ],
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = Omit<
  React.ComponentPropsWithRef<typeof RACButton>,
  "children"
> &
  Omit<ButtonVariantProps, "variant" | "intent"> & {
    classNames?: {
      icon?: string;
    };
    variant?: `${Required<ButtonVariantProps>["variant"]}/${Required<ButtonVariantProps>["intent"]}`;
    isLoading?: boolean;
    /**
     * @ignore use `onPress` instead. onClick is only defined for compatibility with third party libraries.
     */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
    children?: React.ReactElement | string;
    prefix?: React.ReactElement;
    suffix?: React.ReactElement;
  };

export const Button = autoRef(
  ({
    ref,
    variant = `default/primary`,
    isLoading,
    children,
    prefix,
    suffix,
    classNames,
    size,
    iconOnly,
    ...props
  }: ButtonProps) => {
    // create button variants
    const buttonStyle = variant.split("/") as [
      Required<ButtonVariantProps>["variant"],
      Required<ButtonVariantProps>["intent"],
    ];

    // have to use react-aria's useButton hook because of the way it handles press events
    // if any third party library injects "onClick" or "onPointerDown" props (e.g. radix)
    // it would not be propagated to the button
    const { onPointerDown, onClick, ...sanitizedProps } = props;

    return (
      <RACButton
        {...sanitizedProps}
        className={composeClassName(props.className, (className, renderProps) =>
          buttonVariants({
            ...renderProps,
            variant: buttonStyle[0],
            intent: buttonStyle[1],
            size,
            iconOnly,
            className,
          }),
        )}
        onPress={(e) => {
          if (onClick !== undefined) {
            onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
          }

          if (onPointerDown !== undefined) {
            onPointerDown(
              e as unknown as React.PointerEvent<HTMLButtonElement>,
            );
          }

          if (props.onPress !== undefined) {
            props.onPress(e);
          }
        }}
        isDisabled={isLoading || props.isDisabled}
        type={props.form !== undefined ? "submit" : props.type}
        ref={ref}
      >
        {prefix !== undefined && (
          <ButtonIcon
            size={size}
            isLoading={isLoading}
            className={classNames?.icon}
          >
            {prefix}
          </ButtonIcon>
        )}
        {children !== undefined && (
          <Slot className={cn(isLoading && "invisible")}>
            {typeof children === "string" ? <span>{children}</span> : children}
          </Slot>
        )}
        {suffix !== undefined && (
          <ButtonIcon
            size={size}
            isLoading={isLoading}
            className={classNames?.icon}
          >
            {suffix}
          </ButtonIcon>
        )}
        {isLoading && (
          <Loader2Icon
            aria-hidden="true"
            className={cn("absolute h-4 w-4 animate-spin")}
          />
        )}
      </RACButton>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*                                    Icon                                    */
/* -------------------------------------------------------------------------- */
export const buttonIconVariants = tv({
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-3.5 w-3.5",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type ButtonIconProps = {
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof buttonIconVariants>;

export const ButtonIcon = ({
  size,
  isLoading,
  children,
  className,
}: ButtonIconProps) => {
  return (
    <Slot
      aria-hidden="true"
      className={cn(
        buttonIconVariants({ size }),
        isLoading && "invisible",
        className,
      )}
    >
      {children}
    </Slot>
  );
};

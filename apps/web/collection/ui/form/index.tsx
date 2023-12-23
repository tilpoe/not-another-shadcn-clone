"use client";

import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "cva";
import { cva } from "cva";
import type { TextFieldProps } from "react-aria-components";
import {
  Input as RaInput,
  Label as RaLabel,
  TextArea as RaTextArea,
  Text,
} from "react-aria-components";

import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

export interface FormComponentBaseProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  onPressEnter?: () => void;
}

export const handleOnKeyDown =
  (
    onKeyDown?: TextFieldProps["onKeyDown"],
    onPressEnter?: FormComponentBaseProps["onPressEnter"],
  ) =>
  (e: Parameters<NonNullable<TextFieldProps["onKeyDown"]>>[0]) => {
    if (onPressEnter && e.key === "Enter") {
      onPressEnter();
    }

    onKeyDown?.(e);
  };

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const formVariants = {
  wrapper: cva({
    base: "flex flex-col space-y-2",
  }),
  label: cva({
    base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  }),
  description: cva({
    base: "text-sm text-muted-foreground",
  }),
  error: cva({
    base: "text-sm font-medium text-destructive",
  }),
  input: {
    base: cva({
      base: cn(
        "flex w-full rounded-md border border-input  bg-background px-3 py-2 text-base sm:text-sm text-foreground",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-sm placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
      ),
      variants: {
        ring: {
          true: cn(
            "focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary",
          ),
          false: "",
        },
        multiline: {
          true: "",
          false: "h-10",
        },
      },
      defaultVariants: {
        ring: true,
        multiline: false,
      },
    }),
    ring: cva({
      base: cn(
        "rounded-md",
        "focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary",
        "s-focus-within:ring-primary s-focus-within:ring-1 s-focus-within:border-primary",
        /*         "data-[focused=true]:ring-2 data-[focused=true]:ring-offset-2",
        "ring-ring data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-offset-2", */
      ),
    }),
  },
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Wrapper -------------------------------- */

export type FormCompWrapperProps = React.ComponentPropsWithRef<"div">;

export const FormCompWrapper = autoRef(
  ({ className, ...props }: FormCompWrapperProps) => {
    return <div className={cn(formVariants.wrapper(), className)} {...props} />;
  },
);

/* ---------------------------------- Input --------------------------------- */

export type InputProps = React.ComponentPropsWithRef<typeof RaInput> &
  Omit<VariantProps<typeof formVariants.input.base>, "multiline">;

export const Input = autoRef(({ className, ring, ...props }: InputProps) => {
  return (
    <RaInput
      className={(values) =>
        cn(
          formVariants.input.base({ ring }),
          withRenderProps(className)(values),
        )
      }
      {...props}
    />
  );
});

/* -------------------------------- Text Area ------------------------------- */

export type TextAreaProps = React.ComponentPropsWithRef<typeof RaTextArea> &
  Omit<VariantProps<typeof formVariants.input.base>, "multiline">;

export const TextArea = autoRef(
  ({ className, ring, ...props }: TextAreaProps) => {
    return (
      <RaTextArea
        className={(values) =>
          cn(
            formVariants.input.base({ ring, multiline: true }),
            withRenderProps(className)(values),
          )
        }
        {...props}
      />
    );
  },
);

/* ---------------------------------- Label --------------------------------- */

export type LabelProps = React.ComponentPropsWithRef<typeof RaLabel> & {
  as?: "aria" | "label" | "child";
};

export const Label = autoRef(
  ({ className, as = "aria", ...props }: LabelProps) => {
    const compoundClassName = cn(formVariants.label(), className);

    if (!props.children) return null;

    if (as === "aria") {
      return <RaLabel className={compoundClassName} {...props} />;
    } else {
      const Component = as === "child" ? Slot : "label";
      return <Component className={compoundClassName} {...props} />;
    }
  },
);

/* ------------------------------- Description ------------------------------ */

export type DescriptionProps = React.ComponentPropsWithRef<typeof Text>;

export const Description = autoRef(
  ({ className, ...props }: DescriptionProps) => {
    const compoundClassName = cn(formVariants.description(), className);

    if (!props.children) return null;
    return <Text slot="description" className={compoundClassName} {...props} />;
  },
);

/* ---------------------------------- Error --------------------------------- */

export type ErrorMessageProps = React.ComponentPropsWithRef<"div">;

export const ErrorMessage = autoRef(
  ({ className, ...props }: ErrorMessageProps) => {
    if (!props.children) return null;

    return <div className={cn(formVariants.error(), className)} {...props} />;
  },
);

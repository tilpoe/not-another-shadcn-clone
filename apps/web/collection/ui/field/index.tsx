import { Slot } from "@radix-ui/react-slot";
import type {
  FieldErrorProps as RACFieldErrorProps,
  TextFieldProps,
} from "react-aria-components";
import {
  composeRenderProps,
  Group,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  TextArea as RACTextArea,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { autoRef, cn, focusRing } from "@/lib/ui";

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

export interface FieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string;
  onPressEnter?: () => void;
}

export const handleOnKeyDown =
  (
    onKeyDown?: TextFieldProps["onKeyDown"],
    onPressEnter?: FieldProps["onPressEnter"],
  ) =>
  (e: Parameters<NonNullable<TextFieldProps["onKeyDown"]>>[0]) => {
    if (onPressEnter && e.key === "Enter") {
      onPressEnter();
    }

    onKeyDown?.(e);
  };

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      true: "border-ring",
    },
    isInvalid: {
      true: "border-destructive",
    },
    isDisabled: {
      true: "border-ring",
    },
  },
});

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Label --------------------------------- */

export type LabelProps = React.ComponentPropsWithRef<typeof RACLabel> & {
  as?: "rac" | "label" | "child";
};

export const Label = autoRef(({ as = "rac", ...props }: LabelProps) => {
  const compoundClassName = cn(
    "text-sm font-medium w-fit peer-disabled:opacity-70 cursor-default",
    props.className,
  );

  if (!props.children) return null;

  if (as === "rac") {
    return <RACLabel {...props} className={compoundClassName} />;
  } else {
    const Component = as === "child" ? Slot : "label";
    return <Component {...props} className={compoundClassName} />;
  }
});

/* ------------------------------- Description ------------------------------ */

export type DescriptionProps = React.ComponentPropsWithRef<typeof Text>;

export const Description = autoRef((props: DescriptionProps) => {
  if (!props.children) return null;
  return (
    <Text
      {...props}
      slot="description"
      className={cn("text-xs", props.className)}
    />
  );
});

/* ------------------------------- FieldError ------------------------------- */

export type FieldErrorProps = Omit<
  React.ComponentPropsWithRef<typeof RACFieldError>,
  "children" | "className"
> &
  (
    | {
        id: string;
        children?: React.ReactNode;
        className?: string;
      }
    | {
        children?: RACFieldErrorProps["children"];
        className?: RACFieldErrorProps["className"];
      }
  );

export const fieldErrorVariants = tv({
  base: "text-xs text-destructive font-medium",
});

export const FieldError = autoRef((props: FieldErrorProps) => {
  if (!props.children) return null;

  if ("id" in props) {
    return (
      <span
        id={props.id}
        className={fieldErrorVariants({ className: props.className })}
      >
        {props.children}
      </span>
    );
  } else {
    return (
      <RACFieldError
        {...props}
        className={composeRenderProps(
          props.className,
          (className, renderProps) =>
            fieldErrorVariants({ ...renderProps, className }),
        )}
      />
    );
  }
});

/* ------------------------------- FieldGroup ------------------------------- */

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: "group flex items-center h-10 border rounded-md overflow-hidden",
  variants: fieldBorderStyles.variants,
});

export type FieldGroupProps = React.ComponentPropsWithRef<typeof Group>;

export const FieldGroup = autoRef((props: FieldGroupProps) => {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className }),
      )}
    />
  );
});

/* ---------------------------------- Input --------------------------------- */

export type InputProps = React.ComponentPropsWithRef<typeof RACInput>;

export const inputVariants = tv({
  base: cn(
    "flex-1 px-3 py-2 text-base text-foreground outline outline-0 sm:text-sm",
    "disabled:opacity-50",
  ),
});

export const Input = autoRef((props: InputProps) => {
  return (
    <RACInput
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        inputVariants({ ...renderProps, className }),
      )}
    />
  );
});

export type TextAreaProps = React.ComponentPropsWithRef<typeof RACTextArea>;

export const TextArea = autoRef((props: TextAreaProps) => {
  return (
    <RACTextArea
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        inputVariants({ ...renderProps, className }),
      )}
    />
  );
});

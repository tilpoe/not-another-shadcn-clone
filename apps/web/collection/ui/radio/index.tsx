import {
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import type { FieldProps } from "@/collection/ui/field";
import { Description, FieldError, Label } from "@/collection/ui/field";
import { useFieldState } from "@/lib/form-v2";
import { autoRef, cn, composeClassName, focusRing } from "@/lib/ui";

export type RadioGroupProps = Omit<FieldProps, "onPressEnter" | "placeholder"> &
  Omit<React.ComponentPropsWithRef<typeof RACRadioGroup>, "children"> & {
    children?: React.ReactNode;
  };

export const RadioGroup = autoRef(
  ({
    label,
    description,
    errorMessage,
    children,
    ...props
  }: RadioGroupProps) => {
    const fieldState = useFieldState();

    return (
      <RACRadioGroup
        {...props}
        isInvalid={fieldState?.invalid ?? props.isInvalid}
        className={composeClassName(
          props.className,
          "group flex flex-col gap-2",
        )}
      >
        {({ orientation }) => (
          <>
            <Label>{label}</Label>
            <div
              className={cn(
                "flex gap-2",
                orientation === "horizontal" && "gap-4",
                orientation === "vertical" && "flex-col",
              )}
            >
              {children}
            </div>
            <Description>{description}</Description>
            <FieldError>
              {fieldState?.error?.message ?? errorMessage}
            </FieldError>
          </>
        )}
      </RACRadioGroup>
    );
  },
);

const radioVariants = tv({
  extend: focusRing,
  base: cn(
    "flex items-center gap-2 text-sm font-normal",
    "before:content-[''] before:block before:w-4 before:h-4 before:border before:rounded-full before:transition-all",
  ),
  variants: {
    isSelected: {
      true: "before:border-white before:border-[4px] before:bg-primary before:ring-1 before:ring-border",
    },
  },
});

export type RadioProps = React.ComponentPropsWithRef<typeof RACRadio>;

export const Radio = autoRef(({ className, ...props }: RadioProps) => {
  return (
    <RACRadio
      className={composeClassName(className, (className, renderProps) =>
        radioVariants({ ...renderProps, className }),
      )}
      {...props}
    />
  );
});

"use client";

import { Slot } from "@radix-ui/react-slot";
import { CheckIcon, MinusIcon } from "lucide-react";
import { Checkbox as RACCheckbox } from "react-aria-components";

import type { FieldProps } from "@/collection/ui/field";
import { Description, FieldError, Label } from "@/collection/ui/field";
import { useCustomAriaIds, useFieldState } from "@/lib/form-v2";
import { autoRef, cn, composeClassName, formWrapperVariants } from "@/lib/ui";

export type CheckboxProps = Omit<FieldProps, "onPressEnter" | "placeholder"> &
  React.ComponentPropsWithRef<typeof RACCheckbox>;

export const Checkbox = autoRef(
  ({
    className,
    label,
    description,
    errorMessage,
    isInvalid,
    ...props
  }: CheckboxProps) => {
    const fieldState = useFieldState();

    const { descriptionId, errorId, describedBy, error } = useCustomAriaIds({
      errorOrErrorMessage: fieldState?.error?.message ?? errorMessage,
      description,
    });

    return (
      <RACCheckbox
        isInvalid={fieldState?.invalid ?? isInvalid}
        className={composeClassName(className, (className) =>
          cn(
            formWrapperVariants(),
            "group/root grid-cols-[auto_1fr] items-center gap-x-2 disabled:opacity-50",
            className,
          ),
        )}
        aria-describedby={describedBy}
        {...props}
      >
        {({ isIndeterminate }) => (
          <>
            <div
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded border border-input transition-all",
                "group-selected/root:border-primary group-selected/root:bg-primary",
              )}
            >
              <Slot
                className="group-selected/root:stroke-white h-3 w-3 fill-none stroke-transparent stroke-[3px]"
                aria-hidden="true"
              >
                {isIndeterminate ? <MinusIcon /> : <CheckIcon />}
              </Slot>
            </div>
            <Label as="child">
              <span>{label}</span>
            </Label>
            <Description
              id={descriptionId}
              aria-hidden="true"
              className="col-start-2"
            >
              {description}
            </Description>
            <FieldError id={errorId} className="col-start-2">
              {error}
            </FieldError>
          </>
        )}
      </RACCheckbox>
    );
  },
);

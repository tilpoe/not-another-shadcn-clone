"use client";

import { cva } from "cva";
import { Checkbox as RaCheckbox } from "react-aria-components";

import type { FormComponentBaseProps } from "@/collection/ui/form";
import { Description, ErrorMessage, Label } from "@/collection/ui/form";
import { useFormFieldContext } from "@/lib/form/context";
import { useCustomAriaIds } from "@/lib/form/utils";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const checkboxVariants = {
  root: cva({
    base: cn(
      "group/wrapper s-disabled:opacity-60 grid grid-cols-[auto_1fr] items-center gap-x-2 text-sm",
    ),
  }),
  indicatorWrapper: cva({
    base: cn(
      "flex h-4 w-4 items-center justify-center rounded border border-input transition-all",
      "group-s-selected/wrapper:bg-primary group-s-selected/wrapper:border-primary",
    ),
  }),
  indicator: cva({
    base: cn(
      "h-3 w-3 fill-none stroke-primary stroke-[2px] transition-all [stroke-dasharray:22px] [stroke-dashoffset:66]",
      "group-s-selected/wrapper:[stroke-dashoffset:43] group-s-selected/wrapper:stroke-primary-foreground",
    ),
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

export type CheckboxProps = FormComponentBaseProps &
  React.ComponentPropsWithRef<typeof RaCheckbox>;

export const Checkbox = autoRef(
  ({
    className,
    label,
    description,
    errorMessage,
    isInvalid,
    ...props
  }: CheckboxProps) => {
    const formField = useFormFieldContext();

    const { descriptionId, errorId, describedBy, error } = useCustomAriaIds({
      errorOrErrorMessage: formField?.error?.message ?? errorMessage,
      description,
    });

    return (
      <RaCheckbox
        isInvalid={formField?.invalid ?? isInvalid}
        className={(values) =>
          cn(checkboxVariants.root(), withRenderProps(className)(values))
        }
        aria-describedby={describedBy}
        {...props}
      >
        {({ isIndeterminate }) => (
          <>
            <div className={checkboxVariants.indicatorWrapper()}>
              <svg
                viewBox="0 0 18 18"
                aria-hidden="true"
                className={checkboxVariants.indicator()}
              >
                {isIndeterminate ? (
                  <rect x={1} y={7.5} width={15} height={3} />
                ) : (
                  <polyline points="1 9 7 14 15 4" />
                )}
              </svg>
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
            <ErrorMessage id={errorId} className={"col-start-2"}>
              {error}
            </ErrorMessage>
          </>
        )}
      </RaCheckbox>
    );
  },
);

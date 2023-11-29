"use client";

import { cva } from "cva";
import { Radio, RadioGroup as RaRadioGroup } from "react-aria-components";

import type { FormComponentBaseProps } from "@/collection/ui/form";
import { Description, formVariants, Label } from "@/collection/ui/form";
import { FormError } from "@/lib/form";
import { useFormFieldContext } from "@/lib/form/context";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const radioGroupVariants = {
  root: cva({
    base: "grid gap-2",
  }),
  item: cva({
    base: cn(
      "flex items-center gap-2 text-sm font-normal",
      "before:content-[''] before:block before:w-4 before:h-4 before:border before:rounded-full before:transition-all",
      "s-selected:before:border-white s-selected:before:border-[4px] s-selected:before:bg-primary s-selected:before:ring-1 s-selected:before:ring-border",
    ),
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

export type RadioGroupProps = FormComponentBaseProps &
  React.ComponentPropsWithRef<typeof RaRadioGroup>;

export const RadioGroup = autoRef(
  ({
    className,
    isInvalid,
    label,
    description,
    errorMessage,
    children,
    ...props
  }: RadioGroupProps) => {
    const formField = useFormFieldContext();

    return (
      <RaRadioGroup
        className={(values) =>
          cn(formVariants.wrapper(), withRenderProps(className)(values))
        }
        isInvalid={formField?.invalid ?? isInvalid}
        {...props}
      >
        {(values) => (
          <>
            <Label className="mb-1">{label}</Label>
            {withRenderProps(children)(values)}
            <Description>{description}</Description>
            <FormError>{errorMessage}</FormError>
          </>
        )}
      </RaRadioGroup>
    );
  },
);

/* ---------------------------------- Item ---------------------------------- */

export type RadioGroupItem = React.ComponentPropsWithRef<typeof Radio>;

export const RadioGroupItem = autoRef(
  ({ className, ...props }: RadioGroupItem) => {
    return (
      <Radio
        className={(values) =>
          cn(radioGroupVariants.item(), withRenderProps(className)(values))
        }
        {...props}
      />
    );
  },
);

import React from "react";
import { FieldError } from "react-aria-components";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { formVariants } from "@/collection/ui/form";
import {
  FormContext,
  FormFieldContext,
  useFormFieldContext,
} from "@/lib/form/context";
import type { UseFormReturn } from "@/lib/form/utils";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

/* ---------------------------------- Root ---------------------------------- */

export interface FormProps {
  form: UseFormReturn;
  className?: string;
  children?: React.ReactNode;
  as?: "form" | "div";
}

export const Form = ({ form, className, children, as }: FormProps) => {
  const FormWrapper = typeof as === "undefined" ? "form" : as;
  const { id, onSubmit } = form.formProps;

  return (
    <FormContext.Provider value={form}>
      <FormWrapper
        id={id}
        onSubmit={FormWrapper === "form" ? onSubmit : undefined}
        className={className}
      >
        {children}
      </FormWrapper>
    </FormContext.Provider>
  );
};

/* ---------------------------------- Field --------------------------------- */

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName> & {
  nullableDefaultValue?: TFieldValues[TName] | null;
};

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  nullableDefaultValue,
  defaultValue,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller
        defaultValue={
          nullableDefaultValue !== undefined
            ? (nullableDefaultValue as TFieldValues[TName])
            : defaultValue
        }
        {...props}
      />
    </FormFieldContext.Provider>
  );
};

/* -------------------------------- FormError ------------------------------- */

export type FormErrorProps = React.ComponentPropsWithRef<typeof FieldError>;

export const FormError = autoRef(
  ({ children, className, ...props }: FormErrorProps) => {
    const formField = useFormFieldContext();

    if (!children && !formField?.error?.message) return null;

    return (
      <FieldError className={cn(formVariants.error(), className)} {...props}>
        {(values) => (
          <>
            {formField?.error?.message ??
              formField?.error ??
              withRenderProps(children)(values)}
          </>
        )}
      </FieldError>
    );
  },
);

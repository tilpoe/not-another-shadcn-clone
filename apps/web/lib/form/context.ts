import React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";

import type { UseFormReturn } from "@/lib/form/utils";

/* -------------------------------------------------------------------------- */
/*                                    Form                                    */
/* -------------------------------------------------------------------------- */

export type FormContextValue<
  TFieldValues extends FieldValues = any,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
> = UseFormReturn<TFieldValues, TContext, TTransformedValues>;

export const FormContext = React.createContext<FormContextValue | null>(null);

export const useFormContext = <
  TFieldValues extends FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>() => {
  const context = React.useContext(FormContext);

  if (!context) {
    throw new Error("useForm should be used within <Form>");
  }

  return context as unknown as FormContextValue<
    TFieldValues,
    TContext,
    TTransformedValues
  >;
};

/* -------------------------------------------------------------------------- */
/*                                  FormField                                 */
/* -------------------------------------------------------------------------- */

export interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

export const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(null);

export const useFormFieldContext = () => {
  const formContext = React.useContext(FormContext);
  const fieldContext = React.useContext(FormFieldContext);

  if (!formContext || !fieldContext) {
    return null;
  }

  const fieldState = formContext.getFieldState(
    fieldContext.name,
    formContext.formState,
  );

  return {
    ...fieldState,
  };
};

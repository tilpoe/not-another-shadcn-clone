import type { BaseSyntheticEvent } from "react";
import React, { useId, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ControllerProps,
  DefaultValues,
  FieldArray,
  FieldArrayPath,
  FieldArrayWithId,
  FieldErrors,
  FieldPath,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFieldArrayProps,
  UseFieldArrayReturn as UseFieldArrayReturnRHF,
  UseFormReturn as UseFormReturnRHF,
} from "react-hook-form";
import {
  Controller,
  useFieldArray as useFieldArrayRHF,
  useForm as useFormRHF,
} from "react-hook-form";
import type { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

const FormContext = React.createContext<any>(null);

const FormContextProvider = <
  TFieldValues extends FieldValues = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TContextValue extends Record<string, any> = {},
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues,
>({
  form,
  contextValue,
  children,
}: {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  contextValue?: TContextValue;
  children: React.ReactNode;
}) => {
  return (
    <FormContext.Provider value={{ ...form, context: contextValue }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = <
  TFieldValues extends FieldValues = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TContextValue extends Record<string, any> = {},
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues,
>() => {
  const context = React.useContext(FormContext) as UseFormReturn<
    TFieldValues,
    TContext,
    TTransformedValues
  > & {
    context: TContextValue;
  };

  if (!context) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }

  return context;
};

export interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

export const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(null);

export const useFieldState = () => {
  const formContext = React.useContext(FormContext) as UseFormReturn;
  const fieldContext = React.useContext(FormFieldContext);

  if (!formContext || !fieldContext) {
    return null;
  }

  const fieldState = formContext.getFieldState(
    fieldContext.name,
    formContext.formState,
  );

  return fieldState;
};

export const useRACFieldState = (props: {
  isInvalid?: boolean;
  errorMessage?: string;
}) => {
  const fieldState = useFieldState();
  return {
    fieldState,
    isInvalid: fieldState?.invalid ?? props.isInvalid,
    errorMessage: fieldState?.error?.message ?? props.errorMessage,
  };
};

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

export const Form = <
  TFieldValues extends FieldValues = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TContextValue extends Record<string, any> = {},
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues,
>({
  form,
  as,
  children,
  className,
  contextValue,
}: {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  as?: "div" | "form";
  children?: React.ReactNode;
  className?: string;
  contextValue?: TContextValue;
}) => {
  const Component = typeof as === "undefined" ? "form" : as;
  const { id, onSubmit } = form.meta;

  return (
    <FormContextProvider form={form} contextValue={contextValue}>
      <Component
        id={id}
        onSubmit={Component === "form" ? onSubmit : undefined}
        className={className}
      >
        {children}
      </Component>
    </FormContextProvider>
  );
};

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName> & {
  /*   nullableDefaultValue?: TFieldValues[TName] | null; */
};

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  /*   nullableDefaultValue,
  defaultValue, */
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller
        /*         defaultValue={
          nullableDefaultValue !== undefined
            ? (nullableDefaultValue as TFieldValues[TName])
            : defaultValue
        } */
        {...props}
      />
    </FormFieldContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    HOOKS                                   */
/* -------------------------------------------------------------------------- */

export function useCustomAriaIds({
  errorOrErrorMessage,
  description,
}: {
  errorOrErrorMessage?: string;
  description?: string;
}) {
  const id = useId();
  const descriptionId = useId();
  const errorId = useId();
  const describedByArray = [
    description && descriptionId,
    errorOrErrorMessage && errorId,
  ];

  return {
    id,
    describedBy:
      describedByArray.length > 0 ? describedByArray.join(" ") : undefined,
    descriptionId,
    errorId,
    error: errorOrErrorMessage,
  };
}

export interface FormOptions<TSchema extends FieldValues> {
  id?: string;
  onSubmit?: (data: TSchema) => void | Promise<void>;
  onError?: (errors: FieldErrors<TSchema>) => Promise<void> | void;
  defaultValues?: DefaultValues<TSchema>;
  reValidateMode?: "onSubmit" | "onBlur" | "onChange";
  isSubmitting?: boolean;
}

export type UseFormReturn<
  TFieldValues extends FieldValues = any,
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues,
> = Omit<
  UseFormReturnRHF<TFieldValues, TContext, TTransformedValues>,
  "handleSubmit"
> & {
  handleSubmit: (e?: unknown) => void;
  meta: {
    id: string;
    onSubmit: (e?: BaseSyntheticEvent | undefined) => Promise<void>;
  };
};

export const useForm = <TSchema extends z.ZodType>(
  schema: TSchema,
  options?: FormOptions<z.infer<TSchema>>,
): UseFormReturn<z.infer<TSchema>> => {
  type FormSchema = z.infer<TSchema>;
  const id = useId();

  const form = useFormRHF<FormSchema>({
    defaultValues: options?.defaultValues,
    reValidateMode: options?.reValidateMode ?? "onChange",
    resolver: zodResolver(schema),
  });

  // async handler for onValid callback
  const onFormIsValid: SubmitHandler<FormSchema> = async (data, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (options?.onSubmit) await options.onSubmit(data);
  };

  // async handler for onError callback
  const onFormHasError: SubmitErrorHandler<FormSchema> = async (errors, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (options?.onError) await options.onError(errors);
  };

  function handleSubmit(_e?: unknown) {
    void form.handleSubmit(onFormIsValid, onFormHasError)();
  }

  return {
    ...form,
    handleSubmit,
    meta: {
      id,
      onSubmit: form.handleSubmit(onFormIsValid, onFormHasError),
    },
  };
};

type Key = string | number;

export type FieldArrayWithIdAndKey<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends
    FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "_key",
> = FieldArrayWithId<TFieldValues, TFieldArrayName, "id"> &
  Record<TKeyName, Key>;

export type UseFieldArrayReturn<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends
    FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
> = Omit<
  UseFieldArrayReturnRHF<TFieldValues, TFieldArrayName, TKeyName>,
  "fields"
> & {
  fields: FieldArrayWithIdAndKey<TFieldValues, TFieldArrayName, "_key">[];
  insertBefore: (
    key: Key,
    value:
      | FieldArray<TFieldValues, TFieldArrayName>
      | FieldArray<TFieldValues, TFieldArrayName>[],
  ) => void;
  removeByKey: (...keys: Key[]) => void;
  getSafe: (
    key: Key,
  ) => FieldArrayWithIdAndKey<TFieldValues, TFieldArrayName, "_key"> | null;
  get: (
    key: Key,
  ) => FieldArrayWithIdAndKey<TFieldValues, TFieldArrayName, "_key">;
};

export const useFieldArray = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends
    FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
>(
  props: UseFieldArrayProps<TFieldValues, TFieldArrayName, TKeyName>,
): UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName> => {
  const fieldArray = useFieldArrayRHF(props);

  const fields = useMemo(() => {
    if (fieldArray.fields.length === 0)
      return [] as FieldArrayWithIdAndKey<TFieldValues, TFieldArrayName>[];

    const item = fieldArray.fields[0]!;
    if (!("_key" in item)) {
      return fieldArray.fields.map((field) => ({
        ...field,
        // @ts-expect-error id is added from react-hook-form
        _key: field.id as string,
      })) as FieldArrayWithIdAndKey<TFieldValues, TFieldArrayName>[];
    }

    return fieldArray.fields as FieldArrayWithIdAndKey<
      TFieldValues,
      TFieldArrayName
    >[];
  }, [fieldArray.fields]);

  function insertBefore(
    key: Key,
    value:
      | FieldArray<TFieldValues, TFieldArrayName>
      | FieldArray<TFieldValues, TFieldArrayName>[],
  ) {
    let i = 0;
    for (const item of fields) {
      if (item._key == key) {
        fieldArray.insert(i, value);
        break;
      }
      i++;
    }
  }

  function removeByKey(...keys: Key[]) {
    let i = 0;
    for (const item of fields) {
      if (keys.includes(item._key)) {
        fieldArray.remove(i);
      }
      i++;
    }
  }

  function getSafe(key: Key) {
    return fields.find((item) => item._key == key) ?? null;
  }

  function get(key: Key) {
    const value = getSafe(key);
    if (!value) {
      throw new Error("Found no field with this key.");
    }
    return value;
  }

  return {
    ...fieldArray,
    fields,
    insertBefore,
    removeByKey,
    getSafe,
    get,
  };
};

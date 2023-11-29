import type { BaseSyntheticEvent } from "react";
import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ControllerRenderProps,
  DefaultValues,
  FieldErrors,
  FieldPath,
  FieldPathValue,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn as UseDefaultFormReturn,
} from "react-hook-form";
import { useForm as useReactHookForm } from "react-hook-form";
import type { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                Transformers                                */
/* -------------------------------------------------------------------------- */

export const transformField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  field: ControllerRenderProps<TFieldValues, TName>,
  asDefaultValue = false,
) => {
  const { value, ...fieldRest } = field;
  return {
    ...(asDefaultValue ? { defaultValue: value } : { value }),
    ...fieldRest,
  };
};

export const transformToCheckboxFieldField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  field: ControllerRenderProps<TFieldValues, TName>,
  asDefaultValue = false,
) => {
  const { onChange, value, name, ref, onBlur } = field;
  return {
    ...(asDefaultValue ? { defaultSelected: value } : { isSelected: value }),
    ...{ onChange, name, ref, onBlur },
  };
};

export const transformToSliderFieldField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  field: ControllerRenderProps<TFieldValues, TName>,
  asDefaultValue = false,
) => {
  const { onChange, value, ...props } = field;

  return {
    ...props,
    ...(asDefaultValue ? { defaultValue: value } : { value }),
    onValueChange: (value: number[]) => {
      onChange(value);
    },
  };
};

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
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

export interface FormOptions<TSchema extends z.ZodType> {
  id?: string;
  onSubmit?: (data: z.infer<TSchema>) => void | Promise<void>;
  onError?: (errors: FieldErrors<z.infer<TSchema>>) => Promise<void> | void;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  reValidateMode?: "onSubmit" | "onBlur" | "onChange";
  isSubmitting?: boolean;
}

export type UseFormReturn<
  TFieldValues extends FieldValues = any,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
> = Omit<
  UseDefaultFormReturn<TFieldValues, TContext, TTransformedValues>,
  "handleSubmit"
> & {
  id: string;
  formProps: {
    id: string;
    onSubmit: (e?: BaseSyntheticEvent | undefined) => Promise<void>;
  };
  handleSubmit: (e?: BaseSyntheticEvent | undefined) => void;
  safeWatch: <TFieldName extends FieldPath<TFieldValues>>(
    name: TFieldName,
    defaultValue?: FieldPathValue<TFieldValues, TFieldName>,
  ) => FieldPathValue<TFieldValues, TFieldName> | undefined;
  schema: TFieldValues;
  isSubmitting?: boolean;
};

export const useForm = <TSchema extends z.ZodType>(
  schema: TSchema,
  options?: FormOptions<TSchema>,
): UseFormReturn<z.infer<TSchema>> => {
  type FormSchema = z.infer<TSchema>;

  const id = useId();

  const form = useReactHookForm<FormSchema>({
    defaultValues: options?.defaultValues,
    reValidateMode: options?.reValidateMode ?? "onChange",
    resolver: zodResolver(schema),
  });

  // async handler for onValid callback
  const onValid: SubmitHandler<FormSchema> = async (data, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (options?.onSubmit) await options.onSubmit(data);
  };

  // async handler for onError callback
  const onError: SubmitErrorHandler<FormSchema> = async (errors, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (options?.onError) await options.onError(errors);
  };

  // return the function form.watch with the same types but with an added undefined return
  const safeWatch = <TFieldName extends FieldPath<FormSchema>>(
    name: TFieldName,
    defaultValue?: FieldPathValue<FormSchema, TFieldName>,
  ): FieldPathValue<FormSchema, TFieldName> | undefined => {
    const value = form.watch(name, defaultValue);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return typeof value === "undefined" ? undefined : value;
  };

  function handleSubmit(_e?: BaseSyntheticEvent | undefined) {
    void form.handleSubmit(onValid, onError)();
  }

  return {
    ...form,
    id: options?.id ?? id,
    formProps: {
      id: options?.id ?? id,
      onSubmit: form.handleSubmit(onValid, onError),
    },
    //form,
    handleSubmit,
    safeWatch,
    schema: schema,
    isSubmitting: options?.isSubmitting,
  };
};

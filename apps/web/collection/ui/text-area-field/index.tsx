"use client";

import { TextField as RaTextField } from "react-aria-components";

import type { FormComponentBaseProps } from "@/collection/ui/form";
import {
  Description,
  ErrorMessage,
  formVariants,
  handleOnKeyDown,
  Label,
  TextArea,
} from "@/collection/ui/form";
import { useFormFieldContext } from "@/lib/form/context";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

export type TextAreaFieldProps = FormComponentBaseProps &
  React.ComponentPropsWithRef<typeof RaTextField> &
  Pick<React.ComponentPropsWithoutRef<typeof TextArea>, "rows"> & {
    placeholder?: string;
  };

export const TextAreaField = autoRef(
  ({
    onKeyDown,
    onPressEnter,
    label,
    description,
    errorMessage,
    className,
    isInvalid,
    placeholder,
    id,
    rows,
    ...props
  }: TextAreaFieldProps) => {
    const formField = useFormFieldContext();

    return (
      <RaTextField
        onKeyDown={handleOnKeyDown(onKeyDown, onPressEnter)}
        className={(values) =>
          cn(formVariants.wrapper(), withRenderProps(className)(values))
        }
        isInvalid={formField?.invalid ?? isInvalid}
        {...props}
      >
        <Label>{label}</Label>
        <TextArea rows={rows} id={id} placeholder={placeholder} />
        <Description>{description}</Description>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </RaTextField>
    );
  },
);

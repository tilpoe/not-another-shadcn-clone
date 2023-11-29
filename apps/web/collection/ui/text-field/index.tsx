"use client";

import { TextField as RaTextField } from "react-aria-components";

import type { FormComponentBaseProps } from "@/collection/ui/form";
import {
  Description,
  formVariants,
  handleOnKeyDown,
  Input,
  Label,
} from "@/collection/ui/form";
import { FormError } from "@/lib/form";
import { useFormFieldContext } from "@/lib/form/context";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

export type TextFieldProps = FormComponentBaseProps &
  React.ComponentPropsWithRef<typeof RaTextField> & {
    placeholder?: string;
  };

export const TextField = autoRef(
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
    ...props
  }: TextFieldProps) => {
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
        <Input id={id} placeholder={placeholder} />
        <Description>{description}</Description>
        <FormError>{errorMessage}</FormError>
      </RaTextField>
    );
  },
);

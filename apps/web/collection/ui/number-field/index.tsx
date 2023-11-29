"use client";

import {
  Button,
  Group,
  NumberField as RaNumberField,
} from "react-aria-components";

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

export type NumberFieldProps = FormComponentBaseProps &
  React.ComponentPropsWithRef<typeof RaNumberField> & {
    placeholder?: string;
  };

export const NumberField = autoRef(
  ({
    onKeyDown,
    onPressEnter,
    className,
    isInvalid,
    label,
    description,
    errorMessage,
    placeholder,
    ...props
  }: NumberFieldProps) => {
    const formField = useFormFieldContext();

    return (
      <RaNumberField
        onKeyDown={handleOnKeyDown(onKeyDown, onPressEnter)}
        className={(values) =>
          cn(formVariants.wrapper(), withRenderProps(className)(values))
        }
        isInvalid={formField?.invalid ?? isInvalid}
        {...props}
      >
        <Label>{label}</Label>
        <Group className={cn("flex", formVariants.input.ring())}>
          <Button slot="decrement" className="rounded-l-md border px-4">
            -
          </Button>
          <Input
            placeholder={placeholder}
            className="rounded-none border-x-0"
            ring={false}
          />
          <Button slot="increment" className="rounded-r-md border px-4">
            +
          </Button>
        </Group>
        <Description>{description}</Description>
        <FormError>{errorMessage}</FormError>
      </RaNumberField>
    );
  },
);

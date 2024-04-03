import React from "react";
import { TextField as RACTextField } from "react-aria-components";
import { tv } from "tailwind-variants";

import type { FieldProps } from "@/collection/ui/field";
import {
  Description,
  FieldError,
  handleOnKeyDown,
  Input,
  Label,
  TextArea,
} from "@/collection/ui/field";
import { useFieldState } from "@/lib/form-v2";
import { autoRef, composeClassName } from "@/lib/ui";

/* export const textFieldInputVariants = tv({
  base: "border rounded-md",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    ...fieldBorderStyles.variants,
  },
}); */

export const textFieldInputVariants = tv({
  base: "border rounded-md outline-2",
});

export type TextFieldProps = FieldProps &
  React.ComponentPropsWithRef<typeof RACTextField> & {
    multiline?:
      | {
          rows?: number;
        }
      | true;
  };

export const TextField = autoRef(
  ({
    label,
    description,
    placeholder,
    errorMessage,
    onPressEnter,
    multiline,
    ...props
  }: TextFieldProps) => {
    const fieldState = useFieldState();

    return (
      <RACTextField
        {...props}
        className={composeClassName(props.className, "grid gap-y-1")}
        onKeyDown={handleOnKeyDown(props.onKeyDown, onPressEnter)}
        isInvalid={fieldState?.invalid ?? props.isInvalid}
      >
        <Label>{label}</Label>
        {multiline ? (
          <TextArea
            placeholder={placeholder}
            className={textFieldInputVariants}
            rows={typeof multiline === "object" ? multiline.rows : undefined}
          />
        ) : (
          <Input placeholder={placeholder} className={textFieldInputVariants} />
        )}
        <Description>{description}</Description>
        <FieldError>{fieldState?.error?.message ?? errorMessage}</FieldError>
      </RACTextField>
    );
  },
);

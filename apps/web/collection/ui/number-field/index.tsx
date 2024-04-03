import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ButtonProps } from "react-aria-components";
import { Button, NumberField as RACNumberField } from "react-aria-components";

import type { FieldProps } from "@/collection/ui/field";
import {
  Description,
  fieldBorderStyles,
  FieldError,
  FieldGroup,
  handleOnKeyDown,
  Input,
  Label,
} from "@/collection/ui/field";
import { useFieldState } from "@/lib/form-v2";
import { autoRef, composeClassName } from "@/lib/ui";

export type NumberFieldProps = FieldProps &
  React.ComponentPropsWithRef<typeof RACNumberField>;

export const NumberField = autoRef(
  ({
    label,
    description,
    errorMessage,
    placeholder,
    onPressEnter,
    ...props
  }: NumberFieldProps) => {
    const fieldState = useFieldState();

    return (
      <RACNumberField
        {...props}
        className={composeClassName(
          props.className,
          "group flex flex-col gap-1",
        )}
        isInvalid={fieldState?.invalid ?? props.isInvalid}
        onKeyDown={handleOnKeyDown(props.onKeyDown, onPressEnter)}
      >
        <Label>{label}</Label>
        <FieldGroup>
          {(renderProps) => (
            <>
              <Input placeholder={placeholder} />
              <div
                className={fieldBorderStyles({
                  ...renderProps,
                  className: "flex flex-col border-s",
                })}
              >
                <StepperButton slot="increment">
                  <ChevronUpIcon aria-hidden className="h-4 w-4" />
                </StepperButton>
                <div
                  className={fieldBorderStyles({
                    ...renderProps,
                    class: "border-b",
                  })}
                />
                <StepperButton slot="decrement">
                  <ChevronDownIcon aria-hidden className="h-4 w-4" />
                </StepperButton>
              </div>
            </>
          )}
        </FieldGroup>
        <Description>{description}</Description>
        <FieldError>{fieldState?.error?.message ?? errorMessage}</FieldError>
      </RACNumberField>
    );
  },
);

function StepperButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="pressed:bg-gray-100 cursor-default px-0.5 text-gray-500 group-disabled:text-gray-200 "
    />
  );
}

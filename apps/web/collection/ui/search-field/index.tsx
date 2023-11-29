"use client";

import { X } from "lucide-react";
import { Button, SearchField as RaSearchField } from "react-aria-components";

import type { FormComponentBaseProps } from "@/collection/ui/form";
import {
  Description,
  ErrorMessage,
  formVariants,
  handleOnKeyDown,
  Input,
  Label,
} from "@/collection/ui/form";
import { useFormFieldContext } from "@/lib/form/context";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

export type SearchFieldProps = FormComponentBaseProps &
  React.ComponentPropsWithRef<typeof RaSearchField> & {
    placeholder?: string;
  };

export const SearchField = autoRef(
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
  }: SearchFieldProps) => {
    const formField = useFormFieldContext();

    return (
      <RaSearchField
        onKeyDown={handleOnKeyDown(onKeyDown, onPressEnter)}
        className={(values) =>
          cn(
            formVariants.wrapper(),
            withRenderProps(className)(values),
            "group",
          )
        }
        isInvalid={formField?.invalid ?? isInvalid}
        {...props}
      >
        <Label>{label}</Label>
        <div className="grid grid-cols-[1fr_auto] items-center">
          <Input
            id={id}
            placeholder={placeholder}
            className="[&::-webkit-search-cancel-button]:appearance-none"
          />
          <Button className="it -ml-8 h-4 w-4 text-center align-middle group-empty:hidden">
            <X className="h-4 w-4 opacity-50" />
          </Button>
        </div>
        <Description>{description}</Description>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </RaSearchField>
    );
  },
);

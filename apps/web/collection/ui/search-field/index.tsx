import React from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Button, SearchField as RACSearchField } from "react-aria-components";

import type { FieldProps } from "@/collection/ui/field";
import {
  Description,
  FieldError,
  FieldGroup,
  handleOnKeyDown,
  Input,
  Label,
} from "@/collection/ui/field";
import { useFieldState } from "@/lib/form-v2";
import { autoRef, composeClassName } from "@/lib/ui";

export type SearchFieldProps = FieldProps &
  React.ComponentPropsWithRef<typeof RACSearchField>;

export const SearchField = autoRef(
  ({
    label,
    description,
    placeholder,
    errorMessage,
    onPressEnter,
    ...props
  }: SearchFieldProps) => {
    const fieldState = useFieldState();

    return (
      <RACSearchField
        {...props}
        className={composeClassName(props.className, "flex flex-col gap-1")}
        onKeyDown={handleOnKeyDown(props.onKeyDown, onPressEnter)}
        isInvalid={fieldState?.invalid ?? props.isInvalid}
      >
        <Label>{label}</Label>
        <FieldGroup>
          <SearchIcon
            aria-hidden
            className="ml-2 h-4 w-4 text-muted-foreground group-disabled:opacity-50"
          />
          <Input
            placeholder={placeholder}
            className="[&::-webkit-search-cancel-button]:hidden"
          />
          <Button className="mr-1 w-6 text-muted-foreground group-empty:invisible">
            <XIcon aria-hidden className="h-4 w-4" />
          </Button>
        </FieldGroup>
        <Description>{description}</Description>
        <FieldError>{fieldState?.error?.message ?? errorMessage}</FieldError>
      </RACSearchField>
    );
  },
);

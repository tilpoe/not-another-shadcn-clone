"use client";

import { ChevronDownIcon } from "lucide-react";
import type { Key, SelectProps as RACSelectProps } from "react-aria-components";
import {
  Button,
  Select as RACSelect,
  SelectValue,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { useElementSize } from "usehooks-ts";

import type { FieldProps } from "@/collection/ui/field";
import {
  Description,
  FieldError,
  inputVariants,
  Label,
} from "@/collection/ui/field";
import type {
  DropdownItemProps,
  DropdownSectionProps,
} from "@/collection/ui/list-box";
import {
  DropdownItem,
  DropdownSection,
  ListBox,
} from "@/collection/ui/list-box";
import { Popover } from "@/collection/ui/popover";
import { textFieldInputVariants } from "@/collection/ui/text-field";
import { useFieldState } from "@/lib/form-v2";
import { autoRef, cn, composeClassName, focusRing } from "@/lib/ui";

const selectVariants = tv({
  extend: focusRing,
  base: [
    inputVariants(),
    textFieldInputVariants(),
    cn("flex items-center text-start justify-between"),
  ],
});

export type SelectProps<T extends object> = Omit<FieldProps, "onPressEnter"> &
  Omit<RACSelectProps<T>, "children"> & {
    items?: Iterable<T>;
    children: React.ReactNode | ((item: T) => React.ReactNode);
  };

const SelectInternal = <T extends object>({
  label,
  description,
  errorMessage,
  placeholder,
  children,
  items,
  ...props
}: SelectProps<T>) => {
  const fieldState = useFieldState();

  const [triggerRef, { width }] = useElementSize<HTMLButtonElement>();

  return (
    <RACSelect
      {...props}
      isInvalid={fieldState?.invalid ?? props.isInvalid}
      placeholder={placeholder}
      className={composeClassName(props.className, "group flex flex-col gap-1")}
    >
      <Label>{label}</Label>
      <Button className={selectVariants} ref={triggerRef}>
        <SelectValue />
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
      <Description>{description}</Description>
      <FieldError>{fieldState?.error?.message ?? errorMessage}</FieldError>
      <Popover style={{ width }}>
        <ListBox
          className="max-h-[inherit] overflow-scroll p-1 outline-none"
          items={items}
        >
          {children}
        </ListBox>
      </Popover>
    </RACSelect>
  );
};

export const Select = autoRef(SelectInternal);

type SelectItemProps = Omit<DropdownItemProps, "id"> & {
  id: Key;
};

export const SelectItem = (props: SelectItemProps) => {
  return <DropdownItem {...props} />;
};

export const SelectSection = <T extends object>(
  props: DropdownSectionProps<T>,
) => {
  return <DropdownSection {...props} />;
};

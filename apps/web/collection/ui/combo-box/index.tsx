import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import type { ComboBoxProps as RACComboBoxProps } from "react-aria-components";
import { Button, ComboBox as RACComboBox } from "react-aria-components";
import { useElementSize } from "usehooks-ts";

import type { FieldProps } from "@/collection/ui/field";
import {
  Description,
  FieldError,
  FieldGroup,
  handleOnKeyDown,
  Input,
  Label,
} from "@/collection/ui/field";
import { ListBox } from "@/collection/ui/list-box";
import { Popover } from "@/collection/ui/popover";
import { useFieldState } from "@/lib/form-v2";
import { autoRef, cn, composeClassName, formWrapperVariants } from "@/lib/ui";

export type ComboBoxProps<T extends object> = FieldProps &
  Omit<RACComboBoxProps<T>, "children"> & {
    children: React.ReactNode | ((item: T) => React.ReactNode);
    ref?: React.ComponentPropsWithRef<typeof RACComboBox>["ref"];
    isLoading?: boolean;
  };

const ComboBoxInternal = <T extends object>({
  label,
  description,
  errorMessage,
  placeholder,
  onPressEnter,
  onKeyDown,
  items,
  children,
  isLoading,
  ...props
}: ComboBoxProps<T>) => {
  const fieldState = useFieldState();
  const [triggerRef, { width }] = useElementSize();

  return (
    <RACComboBox
      {...props}
      isInvalid={fieldState?.invalid ?? props.isInvalid}
      className={composeClassName(
        props.className,
        cn(formWrapperVariants(), "group"),
      )}
    >
      <Label>{label}</Label>
      <FieldGroup ref={triggerRef}>
        <Input
          placeholder={placeholder}
          onKeyDown={handleOnKeyDown(onKeyDown, onPressEnter)}
        />
        {isLoading ? (
          <div className="mr-1 w-6">
            <Loader2Icon aria-hidden="true" className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <Button className="mr-1 w-6 rounded">
            <ChevronDownIcon aria-hidden className="h-4 w-4" />
          </Button>
        )}
      </FieldGroup>
      <Description>{description}</Description>
      <FieldError>{fieldState?.error?.message ?? errorMessage}</FieldError>
      <Popover style={{ width }}>
        <ListBox
          items={items}
          className="max-h-[inherit] overflow-auto p-1 outline-0 [clip-path:inset(0_0_0_0_round_.75rem)]"
        >
          {children}
        </ListBox>
      </Popover>
    </RACComboBox>
  );
};

export const ComboBox = autoRef(ComboBoxInternal);

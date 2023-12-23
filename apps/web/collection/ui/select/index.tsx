import { useId, useMemo } from "react";
import { cva } from "cva";
import { ChevronsUpDown, X } from "lucide-react";
import {
  Button,
  Header,
  ListBox,
  ListBoxItem,
  Popover,
  Select as RaSelect,
  Section,
} from "react-aria-components";

import type { FormComponentBaseProps } from "@/collection/ui/form";
import { Description, formVariants, Label } from "@/collection/ui/form";
import { popoverVariants } from "@/collection/ui/popover";
import { useFormFieldContext } from "@/lib/form/context";
import { useCustomAriaIds } from "@/lib/form/utils";
import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const selectVariants = {
  group: cva({
    base: cn("overflow-hidden p-1 text-foreground"),
  }),
  item: cva({
    base: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none ",
      "s-selected:bg-accent s-selected:text-accent-foreground",
      "s-focused-visible:bg-accent s-focused-visible:text-accent-foreground",
      "s-hover:bg-accent s-hover:text-accent-foreground",
    ),
  }),
  header: cva({
    base: cn("px-2 py-1.5 text-xs font-medium text-muted-foreground"),
  }),
};

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

/**
 * Every option for the select component has to be of this type.
 */
export interface SelectOption<TValue = null> {
  label: string; // The label that is displayed in the select
  disabled?: boolean;
  value: TValue;
  group?: string; // The group that this option belongs to
}

/**
 * Alias for an array of options, so that it's easier to remember when declaring the options array.
 */
export type SelectOptions<TValue = null> = SelectOption<TValue>[];

export type SelectBaseProps<TValue = null> = {
  className?: string;
  classNames?: {
    selected?: string;
  };
  disabled?: boolean;
  options: SelectOptions<TValue>;
  onSelect?: (option: SelectOption<TValue>) => void; // this event handles everything that happens when you click on an option, except for the state change itself
  placeholder?: string;
} & {
  ref?: React.ComponentPropsWithRef<typeof RaSelect>["ref"];
};

type DependentOnChange<TValue> =
  | {
      isResettable?: false;
      onChange?: (option: SelectOption<TValue>) => void; // this event only handles the value change
    }
  | {
      isResettable: true;
      onChange?: (option: SelectOption<TValue> | null) => void; // this event only handles the value change
    };

export type SelectProps<TValue = null> = FormComponentBaseProps &
  SelectBaseProps<TValue> &
  ({
    value: SelectOption<TValue> | null;
  } & DependentOnChange<TValue>) &
  /*     | {
        multi: true;
        value: SelectOptions<TValue>;
        isResettable?: boolean;
        onChange?: (options: SelectOptions<TValue>) => void; // this event only handles the value change
      } */
  (| {
        type: "combo";
        searchLabel?: string;
        notFoundLabel?: string;
      }
    | {
        type?: "list";
      }
  );

type SelectPropsWithoutRef<TValue = null> = React.PropsWithoutRef<
  SelectProps<TValue>
>;

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function valueIsEmpty<TValue>(props: SelectPropsWithoutRef<TValue>) {
  return props.value === null;
}

/* function valueIsSelected<TValue>(
  props: SelectPropsWithoutRef<TValue>,
  option: SelectOption<TValue>,
) {
  return props.value?.value === option.value;
} */

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ------------------------------- ResetButton ------------------------------ */

export const SelectResetButton = <TValue,>(
  props: SelectPropsWithoutRef<TValue>,
) => {
  if (props.isResettable && !valueIsEmpty(props)) {
    return (
      <div
        role="button"
        aria-hidden="true"
        onClick={(e) => {
          e.stopPropagation();
          props.onChange?.(null);
        }}
        className="mr-2 rounded-full p-1 hover:bg-muted"
      >
        <X className="h-3 w-3 text-muted-foreground" />
      </div>
    );
  }

  return null;
};

/* ------------------------------ SelectedValue ----------------------------- */

const SelectSelectedValue = <TValue,>(
  props: SelectPropsWithoutRef<TValue> & {
    id: string;
  },
) => {
  const selectedClassNames = cn(
    "block truncate text-sm text-foreground",
    props.classNames?.selected,
  );

  if (props.value === null || props.value === undefined) {
    return (
      <span
        id={props.id}
        className={"block truncate text-sm italic text-muted-foreground"}
      >
        {props.placeholder}
      </span>
    );
  }

  return (
    <span id={props.id} className={selectedClassNames}>
      {props.value.label}
    </span>
  );
};

/* ------------------------------- GroupHeader ------------------------------ */

export const SelectGroupHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Header className={cn(selectVariants.header())}>{children}</Header>;
};

/* ---------------------------------- Group --------------------------------- */

export const SelectGroup = ({ children }: { children: React.ReactNode }) => {
  return <Section className={cn(selectVariants.group())}>{children}</Section>;
};

/* ---------------------------------- Item ---------------------------------- */

export const SelectItem = <TValue,>(
  props: SelectPropsWithoutRef<TValue> & {
    option: SelectOption<TValue>;
    id: string;
  },
) => {
  return (
    <ListBoxItem
      id={props.id}
      value={props.option.value as object}
      className={cn(selectVariants.item())}
    >
      {props.option.label}
    </ListBoxItem>
  );
};

/* --------------------------------- Select --------------------------------- */

const SelectInternal = <TValue,>({ ref, ...props }: SelectProps<TValue>) => {
  const { className, options, disabled, description } = props;

  const formField = useFormFieldContext();
  const labelId = useId();
  const selectedValueId = useId();
  const error = formField?.error?.message ?? props.errorMessage;
  const { id, describedBy, descriptionId, errorId } = useCustomAriaIds({
    errorOrErrorMessage: error,
    description,
  });

  const sortedOptions = useMemo(() => {
    const sorted = {
      ungrouped: [] as (SelectOption<TValue> & { id: number })[],
      grouped: {} as Record<string, (SelectOption<TValue> & { id: number })[]>,
      all: [] as (SelectOption<TValue> & { id: number })[],
    };

    let selected;
    options.forEach((option, id) => {
      if (option == props.value) {
        selected = id;
      }

      if (option.group) {
        sorted.grouped[option.group] ??= [];
        sorted.grouped[option.group]!.push({
          ...option,
          id,
        });
      } else {
        sorted.ungrouped.push({
          ...option,
          id,
        });
      }

      sorted.all.push({
        ...option,
        id,
      });
    });

    return {
      sorted,
      selected,
    };
  }, [options, props.value]);

  return (
    <div className={cn(formVariants.wrapper(), className)}>
      <Label as="label" htmlFor={id}>
        {props.label}
      </Label>
      <RaSelect
        isDisabled={disabled}
        ref={ref}
        id={id}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        selectedKey={sortedOptions.selected}
        onSelectionChange={(key) => {
          if (!props.onChange) return;
          const selected = sortedOptions.sorted.all.find(
            (option) => option.id == key,
          );

          if (!selected) {
            throw new Error("Selected option not found");
          }

          const { id: _id, ...selectedValue } = selected;
          props.onChange(selectedValue);
        }}
      >
        <Button
          className={cn(
            formVariants.input.base(),
            "flex items-center justify-between",
            className,
          )}
          aria-labelledby={selectedValueId}
        >
          <span className="flex w-full items-center justify-between gap-1">
            <span className="shrink-0">
              <SelectResetButton {...props} />
              <SelectSelectedValue id={selectedValueId} {...props} />
            </span>
            <span>
              <ChevronsUpDown
                aria-hidden="true"
                className="h-4 w-4 text-muted-foreground"
              />
            </span>
          </span>
        </Button>
        <Popover
          className={cn(
            popoverVariants.root(),
            "w-[var(--trigger-width)]",
            className,
          )}
        >
          <ListBox className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white">
            <SelectGroup>
              {sortedOptions.sorted.ungrouped.map((option) => (
                <SelectItem
                  id={option.id.toString()}
                  key={option.id}
                  option={option}
                  {...props}
                />
              ))}
            </SelectGroup>
            {Object.entries(sortedOptions.sorted.grouped).map(
              ([group, options]) => (
                <SelectGroup key={group}>
                  <SelectGroupHeader>{group}</SelectGroupHeader>
                  {options.map((option) => (
                    <SelectItem
                      id={option.id.toString()}
                      key={option.id}
                      option={option}
                      {...props}
                    />
                  ))}
                </SelectGroup>
              ),
            )}
          </ListBox>
        </Popover>
      </RaSelect>
      <Description id={descriptionId} aria-hidden="true">
        {description}
      </Description>
      <div id={errorId} className={cn(formVariants.error())}>
        {error}
      </div>
    </div>
  );
};

export const Select = autoRef(SelectInternal);

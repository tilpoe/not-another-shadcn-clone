"use client";

import { useId, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { useElementSize } from "usehooks-ts";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/collection/ui/command";
import type { FormComponentBaseProps } from "@/collection/ui/form";
import { Description, formVariants, Label } from "@/collection/ui/form";
import { popoverVariants } from "@/collection/ui/popover";
import { useFormFieldContext } from "@/lib/form/context";
import { useCustomAriaIds } from "@/lib/form/utils";
import { autoRef, cn } from "@/lib/utils";

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
  ref?: React.ComponentPropsWithRef<typeof PopoverContent>["ref"];
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
  (
    | ({
        multi?: false;
        value: SelectOption<TValue> | null;
      } & DependentOnChange<TValue>)
    | {
        multi: true;
        value: SelectOptions<TValue>;
        isResettable?: boolean;
        onChange?: (options: SelectOptions<TValue>) => void; // this event only handles the value change
      }
  ) &
  (
    | {
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
  if (props.multi) {
    return props.value === null || props.value.length === 0;
  } else {
    return props.value === null;
  }
}

function valueIsSelected<TValue>(
  props: SelectPropsWithoutRef<TValue>,
  option: SelectOption<TValue>,
) {
  if (props.multi) {
    return props.value.includes(option);
  } else {
    return props.value?.value === option.value;
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

const Input = <TValue,>(props: SelectPropsWithoutRef<TValue>) => {
  switch (props.type) {
    case "combo": {
      return <CommandInput placeholder={props.searchLabel} />;
    }
    default: {
      return (
        <CommandInput className="sr-only border-none p-0" aria-hidden="true" />
      );
    }
  }
};

const Empty = <TValue,>(props: SelectPropsWithoutRef<TValue>) => {
  switch (props.type) {
    case "combo": {
      return <CommandEmpty>{props.notFoundLabel}</CommandEmpty>;
    }
    default: {
      return null;
    }
  }
};

const Placeholder = ({ children }: { children?: React.ReactNode }) => {
  return (
    <span className={"block truncate text-sm italic text-muted-foreground"}>
      {children}
    </span>
  );
};

const Title = <TValue,>(props: SelectPropsWithoutRef<TValue>) => {
  const selectedClassNames = cn(
    "block truncate text-sm",
    props.classNames?.selected,
  );

  if (!props.multi) {
    if (props.value === null) {
      return <Placeholder>{props.placeholder}</Placeholder>;
    }

    return <span className={selectedClassNames}>{props.value.label}</span>;
  }

  if (props.value.length === 0) {
    return <Placeholder>{props.placeholder}</Placeholder>;
  }

  return <span className={selectedClassNames}>{props.value.join(", ")}</span>;
};

const ResetButton = <TValue,>(props: SelectPropsWithoutRef<TValue>) => {
  if (props.isResettable && !valueIsEmpty(props)) {
    return (
      <div
        role="button"
        aria-hidden="true"
        onClick={(e) => {
          e.stopPropagation();
          if (props.multi) {
            props.onChange?.([]);
          } else {
            props.onChange?.(null);
          }
        }}
        className="mr-2 rounded-full p-1 hover:bg-muted"
      >
        <X className="h-3 w-3 text-muted-foreground" />
      </div>
    );
  }

  return null;
};

const Item = <TValue,>(
  props: SelectPropsWithoutRef<TValue> & {
    option: SelectOption<TValue>;
    setIsOpen: (isOpen: boolean) => void;
  },
) => {
  function handleSelectOption(option: SelectOption<TValue>) {
    if (!props.multi) {
      props.onChange?.(option);
    }
    props.onSelect?.(option);
    props.setIsOpen(false);
  }

  return (
    <CommandItem
      disabled={props.option.disabled}
      value={props.option.label}
      onSelect={() => {
        handleSelectOption(props.option);
      }}
      className={cn(valueIsSelected(props, props.option) && "")}
      data-checked={valueIsSelected(props, props.option)}
      aria-checked={valueIsSelected(props, props.option)}
    >
      {props.option.label}
    </CommandItem>
  );
};

const SelectInternal = <TValue,>({ ref, ...props }: SelectProps<TValue>) => {
  const { className, options, disabled, description } = props;

  const sortedOptions = useMemo(() => {
    const sorted = {
      ungrouped: [] as (SelectOption<TValue> & { id: number })[],
      grouped: {} as Record<string, (SelectOption<TValue> & { id: number })[]>,
    };

    options.forEach((option, id) => {
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
    });

    return sorted;
  }, [options]);

  const formField = useFormFieldContext();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRef, { width }] = useElementSize<HTMLButtonElement>();
  const contentId = useId();
  const error = formField?.error?.message ?? props.errorMessage;
  const { id, describedBy, descriptionId, errorId } = useCustomAriaIds({
    errorOrErrorMessage: error,
    description,
  });

  return (
    <div className={cn(formVariants.wrapper(), className)}>
      <Label as="label" htmlFor={id}>
        {props.label}
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            ref={buttonRef}
            aria-expanded={isOpen}
            aria-controls={contentId}
            aria-describedby={describedBy}
            className={cn(
              formVariants.input.base(),
              "flex items-center justify-between",
              className,
            )}
          >
            <span className="flex w-full items-center">
              <ResetButton {...props} />
              <Title {...props} />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            id={contentId}
            style={{ width }}
            className={cn(popoverVariants.root({ className }), "mt-1")}
            ref={ref}
          >
            <Command className="p-0" aria-multiselectable={props.multi}>
              <Input {...props} />
              <CommandList>
                <Empty {...props} />
                <CommandGroup className="p-0">
                  {sortedOptions.ungrouped.map((option) => (
                    <Item
                      key={option.id}
                      setIsOpen={setIsOpen}
                      option={option}
                      {...props}
                    />
                  ))}
                </CommandGroup>
                {Object.entries(sortedOptions.grouped).map(
                  ([group, options]) => (
                    <CommandGroup key={group} heading={group}>
                      {options.map((option) => (
                        <Item
                          key={option.id}
                          setIsOpen={setIsOpen}
                          option={option}
                          {...props}
                        />
                      ))}
                    </CommandGroup>
                  ),
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
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

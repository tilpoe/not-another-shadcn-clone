import { CheckIcon } from "lucide-react";
import type {
  ListBoxItemProps as RACListBoxItemProps,
  ListBoxProps as RACListBoxProps,
  SectionProps,
} from "react-aria-components";
import {
  Collection,
  composeRenderProps,
  Header,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Section,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { composeClassName } from "@/lib/ui";

type ListBoxProps<T> = Omit<RACListBoxProps<T>, "layout" | "orientation">;

export function ListBox<T extends object>({
  children,
  ...props
}: ListBoxProps<T>) {
  return (
    <RACListBox
      {...props}
      className={composeClassName(
        props.className,
        "borderp-1 rounded-md outline-0 ",
      )}
    >
      {children}
    </RACListBox>
  );
}

export const dropdownItemVariants = tv({
  base: "group flex items-center gap-4 cursor-default select-none py-1.5 pl-2 pr-2 rounded-sm outline outline-0 text-sm",
  variants: {
    isDisabled: {
      false: "text-gray-900 dark:text-zinc-100",
      true: "pointer-events-none opacityy-50",
    },
    isFocused: {
      true: "bg-accent text-accent-foreground",
    },
  },
});

export type DropdownItemProps = RACListBoxItemProps;

export function DropdownItem(props: RACListBoxItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <RACListBoxItem
      {...props}
      textValue={textValue}
      className={dropdownItemVariants}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="group-selected:font-semibold flex flex-1 items-center gap-2 truncate font-normal">
            {children}
          </span>
          <span className="flex w-5 items-center">
            {isSelected && <CheckIcon className="h-3 w-3" />}
          </span>
        </>
      ))}
    </RACListBoxItem>
  );
}

export interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string;
}

export function DropdownSection<T extends object>(
  props: DropdownSectionProps<T>,
) {
  return (
    <Section className="after:block after:h-[5px] after:content-[''] first:-mt-[5px]">
      <Header className="sticky -top-[5px] z-10 -mx-1 -mt-px truncate border-y bg-gray-100/60 px-4 py-1 text-sm font-semibold text-gray-500 backdrop-blur-md supports-[-moz-appearance:none]:bg-gray-100 dark:border-y-zinc-700 dark:bg-zinc-700/60 dark:text-zinc-300 [&+*]:mt-1">
        {props.title}
      </Header>
      <Collection items={props.items}>{props.children}</Collection>
    </Section>
  );
}

import { CheckIcon } from "lucide-react";
import type {
  Key,
  PopoverProps,
  MenuItemProps as RACMenuItemProps,
  MenuProps as RACMenuProps,
  SeparatorProps,
} from "react-aria-components";
import {
  composeRenderProps,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
} from "react-aria-components";

import type { DropdownSectionProps } from "@/collection/ui/list-box";
import {
  dropdownItemVariants,
  DropdownSection,
} from "@/collection/ui/list-box";
import { Popover } from "@/collection/ui/popover";
import { Separator } from "@/collection/ui/separator";

export type MenuProps<T> = RACMenuProps<T> & {
  placement?: PopoverProps["placement"];
};

export function Menu<T extends object>(props: MenuProps<T>) {
  return (
    <Popover placement={props.placement} className="min-w-[150px]">
      <RACMenu
        {...props}
        className="max-h-[inherit] overflow-auto p-1 outline outline-0 [clip-path:inset(0_0_0_0_round_.75rem)]"
      />
    </Popover>
  );
}

type MenuItemProps = Omit<RACMenuItemProps, "id"> & {
  id: Key;
};

export function MenuItem(props: MenuItemProps) {
  return (
    <RACMenuItem {...props} className={dropdownItemVariants}>
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected }) => (
          <>
            {selectionMode !== "none" && (
              <span className="flex w-4 items-center">
                {isSelected && <CheckIcon aria-hidden className="h-4 w-4" />}
              </span>
            )}
            <span className="group-selected:font-semibold flex flex-1 items-center gap-2 truncate font-normal">
              {children}
            </span>
          </>
        ),
      )}
    </RACMenuItem>
  );
}

export function MenuSeparator(props: SeparatorProps) {
  return (
    <Separator
      {...props}
      className="mx-3 my-1 border-b border-gray-300 dark:border-zinc-700"
    />
  );
}

export function MenuSection<T extends object>(props: DropdownSectionProps<T>) {
  return <DropdownSection {...props} />;
}

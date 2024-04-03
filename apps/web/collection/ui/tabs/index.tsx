"use client";

import type {
  TabPanelProps as RACTabPanelProps,
  TabProps as RACTabProps,
  TabListProps,
  TabsProps,
} from "react-aria-components";
import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { composeClassName, focusRing } from "@/lib/ui";

const tabsVariants = tv({
  base: "flex gap-4",
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row w-[800px]",
    },
  },
});

export function Tabs(props: TabsProps) {
  return (
    <RACTabs
      {...props}
      className={composeClassName(props.className, (className, renderProps) =>
        tabsVariants({ ...renderProps, className }),
      )}
    />
  );
}

const tabListVariants = tv({
  base: "flex gap-1",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
});

export function TabList<T extends object>(props: TabListProps<T>) {
  return (
    <RACTabList
      {...props}
      className={composeClassName(props.className, (className, renderProps) =>
        tabListVariants({ ...renderProps, className }),
      )}
    />
  );
}

const tabVariants = tv({
  extend: focusRing,
  base: "whitespace-nowrap border-b-2 border-transparent px-2 py-3 font-medium transition-all hover:border-primary hover:text-primary select-none",
  variants: {
    isSelected: {
      true: "border-primary text-primary",
    },
    isDisabled: {
      true: "opacity-50 pointer-events-none",
    },
  },
});

export type TabProps = Omit<RACTabProps, "id"> & {
  id: string;
};

export function Tab(props: TabProps) {
  return (
    <RACTab
      {...props}
      className={composeClassName(props.className, (className, renderProps) =>
        tabVariants({ ...renderProps, className }),
      )}
    />
  );
}

export const tabPanelVariants = tv({
  extend: focusRing,
  base: "flex-1 p-4 text-sm",
});

export type TabPanelProps = Omit<RACTabPanelProps, "id"> & {
  id: string;
};

export function TabPanel(props: TabPanelProps) {
  return (
    <RACTabPanel
      {...props}
      className={composeClassName(props.className, (className, renderProps) =>
        tabPanelVariants({ ...renderProps, className }),
      )}
    />
  );
}

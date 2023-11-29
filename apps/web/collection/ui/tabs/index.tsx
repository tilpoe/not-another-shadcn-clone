"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "cva";

import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const tabsVariants = {
  list: cva({
    base: "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  }),
  trigger: cva({
    base: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
    ),
  }),
  content: cva({
    base: "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

export const Tabs = TabsPrimitive.Root;

/* ---------------------------------- List ---------------------------------- */

export type TabsListProps = React.ComponentPropsWithRef<
  typeof TabsPrimitive.List
>;

export const TabsList = autoRef(({ className, ...props }: TabsListProps) => {
  return (
    <TabsPrimitive.List
      className={cn(tabsVariants.list(), className)}
      {...props}
    />
  );
});

/* --------------------------------- Trigger -------------------------------- */

export type TabsTriggerProps = React.ComponentPropsWithRef<
  typeof TabsPrimitive.Trigger
>;

export const TabsTrigger = autoRef(
  ({ className, ...props }: TabsTriggerProps) => {
    return (
      <TabsPrimitive.Trigger
        className={cn(tabsVariants.trigger(), className)}
        {...props}
      />
    );
  },
);

/* --------------------------------- Content -------------------------------- */

export type TabsContentProps = React.ComponentPropsWithRef<
  typeof TabsPrimitive.Content
>;

export const TabsContent = autoRef(
  ({ className, ...props }: TabsContentProps) => {
    return (
      <TabsPrimitive.Content
        className={cn(tabsVariants.content(), className)}
        {...props}
      />
    );
  },
);

"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva } from "cva";
import { ChevronDown } from "lucide-react";

import { autoRef, cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const accordionVariants = {
  item: cva({
    base: "border-b",
  }),
  trigger: cva({
    base: "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
  }),
  content: cva({
    base: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

export const Accordion = AccordionPrimitive.Root;

/* ---------------------------------- Item ---------------------------------- */

export type AccordionItemProps = React.ComponentPropsWithRef<
  typeof AccordionPrimitive.Item
>;

export const AccordionItem = autoRef(
  ({ className, ...props }: AccordionItemProps) => {
    return (
      <AccordionPrimitive.Item
        className={cn(accordionVariants.item(), className)}
        {...props}
      />
    );
  },
);

/* --------------------------------- Trigger -------------------------------- */

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
>;

export const AccordionTrigger = autoRef(
  ({ className, children, ...props }: AccordionTriggerProps) => {
    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(accordionVariants.trigger(), className)}
          {...props}
        >
          {children}
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);

/* --------------------------------- Content -------------------------------- */

export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
>;

export const AccordionContent = autoRef(
  ({ className, children, ...props }: AccordionContentProps) => {
    return (
      <AccordionPrimitive.Content
        className={cn(accordionVariants.content())}
        {...props}
      >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
      </AccordionPrimitive.Content>
    );
  },
);

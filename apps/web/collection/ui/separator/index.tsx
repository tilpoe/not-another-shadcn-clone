"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { autoRef, cn } from "@/lib/utils";

export type SeparatorProps = React.ComponentPropsWithRef<
  typeof SeparatorPrimitive.Root
>;

const Separator = autoRef(
  ({
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
  }: SeparatorProps) => {
    return (
      <SeparatorPrimitive.Root
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className,
        )}
        {...props}
      />
    );
  },
);

export { Separator };

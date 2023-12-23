import React from "react";
import type { VariantProps } from "cva";
import { cva } from "cva";

import { cn } from "@/lib/utils";

export const Container = ({
  children,
  className,
  grow,
}: {
  children?: React.ReactNode;
  className?: string;
  grow?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center px-6 -sm:px-4",
        grow && "grow overflow-scroll",
        className,
      )}
    >
      {children}
    </div>
  );
};

const containerInnerVariants = cva({
  base: "h-full w-full max-w-6xl grow space-y-4",
  variants: {
    width: {
      default: "max-w-7xl",
      lg: "max-w-8xl",
      xl: "max-w-[90rem]",
      max: "max-w-[2000px]",
    },
  },
  defaultVariants: {
    width: "default",
  },
});

export const ContainerInner = ({
  children,
  className,
  width,
}: {
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof containerInnerVariants>) => {
  return (
    <div className={cn(containerInnerVariants({ width }), className)}>
      {children}
    </div>
  );
};

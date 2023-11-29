import * as React from "react";
import type { VariantProps } from "cva";
import { cva } from "cva";

import { cn } from "@/lib/utils";

export const badgeVariants = cva({
  base: cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ),
  variants: {
    variant: {
      default: "border-transparent",
      invert: "border-transparent",
      outline: "",
    },
    intent: {
      default: "",
      secondary: "",
      destructive: "",
      warning: "",
      success: "",
      info: "",
    },
    size: {
      xs: "px-[7px] py-[1px] text-[0.6rem]",
      sm: "px-[8px] py-[3px] text-[0.7rem]",
      default: "px-[9px] py-[5px] text-xs",
      lg: "px-[10px] py-[6px] text-xs",
    },
  },
  compoundVariants: [
    // default variant
    {
      variant: "default",
      intent: "default",
      className: "bg-primary text-primary-foreground",
    },
    {
      variant: "default",
      intent: "secondary",
      className: "bg-secondary text-secondary-foreground",
    },
    {
      variant: "default",
      intent: "info",
      className: "bg-sky-500 text-white",
    },
    {
      variant: "default",
      intent: "destructive",
      className: "bg-destructive text-destructive-foreground",
    },
    {
      variant: "default",
      intent: "warning",
      className: "bg-orange-500 text-white",
    },
    {
      variant: "default",
      intent: "success",
      className: "bg-green-600 text-white",
    },
    // invert variant
    {
      variant: "invert",
      intent: "success",
      className: "bg-green-500/20 text-green-600",
    },
    {
      variant: "invert",
      intent: "warning",
      className: "bg-orange-500/20 text-orange-500",
    },
    {
      variant: "invert",
      intent: "destructive",
      className: "bg-destructive/20 text-destructive",
    },
    {
      variant: "invert",
      intent: "info",
      className: "bg-sky-500/20 text-sky-500",
    },
    {
      variant: "invert",
      intent: "secondary",
      className: "bg-secondary-foreground/40 text-secondary",
    },
    {
      variant: "invert",
      intent: "default",
      className: "bg-primary/20 text-primary",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
    intent: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  intent,
  size,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, intent, size }), className)}
      {...props}
    />
  );
}

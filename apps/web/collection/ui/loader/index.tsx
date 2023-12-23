"use client";

import type { VariantProps } from "cva";
import { cva } from "cva";
import { ClipLoader } from "react-spinners";

import { cn } from "@/lib/utils";

const loaderVariants = cva({
  base: "!border-[hsl(var(--primary))_hsl(var(--primary))_transparent] fill-primary text-primary",
  variants: {
    size: {
      default: "!w-16 !h-16",
      lg: "!w-20 !h-20",
    },
  },
});

type LoaderProps = VariantProps<typeof loaderVariants> & {
  text?: string;
  className?: string;
};

export const Loader = ({ size = "default", text, className }: LoaderProps) => {
  return (
    <div className={cn("flex flex-col items-center space-y-3", className)}>
      <ClipLoader className={cn(loaderVariants({ size }))} />
      {text && <span>{text}</span>}
    </div>
  );
};

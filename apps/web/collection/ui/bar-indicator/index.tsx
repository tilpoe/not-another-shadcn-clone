"use client";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */
import { cva } from "cva";

import { formVariants, Label } from "@/collection/ui/form";
import { autoRef, cn } from "@/lib/utils";

export const barIndicatorVariants = {
  root: cva({
    base: cn(formVariants.wrapper()),
  }),
  labels: cva({
    base: "flex items-center justify-between",
  }),
  meter: cva({
    base: "relative h-2 w-full rounded-full bg-muted",
  }),
  progress: cva({
    base: "absolute top-[50%] h-2 translate-y-[-50%] rounded-full bg-primary",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Labels --------------------------------- */

export type BarIndicatorLabelsProps = React.ComponentPropsWithRef<"div"> & {
  label: React.ReactNode;
  value: React.ReactNode;
};

export const BarIndicatorLabels = autoRef(
  ({ className, label, value, ...props }: BarIndicatorLabelsProps) => {
    return (
      <div className={cn(barIndicatorVariants.labels(), className)} {...props}>
        <Label>{label}</Label>
        <span>{value}</span>
      </div>
    );
  },
);

/* ---------------------------------- Meter --------------------------------- */

export type BarIndicatorMeterProps = React.ComponentPropsWithRef<"div">;

export const BarIndicatorMeter = autoRef(
  ({ className, ...props }: BarIndicatorMeterProps) => {
    return (
      <div {...props} className={cn(barIndicatorVariants.meter(), className)} />
    );
  },
);

/* -------------------------------- Progress -------------------------------- */

export type BarIndicatorProgressProps = React.ComponentPropsWithRef<"div">;

export const BarIndicatorProgress = autoRef(
  ({ className, ...props }: BarIndicatorProgressProps) => {
    return (
      <div
        {...props}
        className={cn(barIndicatorVariants.progress(), className)}
      />
    );
  },
);

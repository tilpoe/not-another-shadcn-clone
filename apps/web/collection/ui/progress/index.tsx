"use client";

import { ProgressBar } from "react-aria-components";

import {
  BarIndicatorLabels,
  BarIndicatorMeter,
  BarIndicatorProgress,
  barIndicatorVariants,
} from "@/collection/ui/bar-indicator";
import { cn, withRenderProps } from "@/lib/utils";

export type ProgressProps = React.ComponentPropsWithRef<typeof ProgressBar> & {
  label?: string;
};

export const Progress = ({ className, ...props }: ProgressProps) => {
  return (
    <ProgressBar
      {...props}
      className={(values) =>
        cn(cn(barIndicatorVariants.root(), withRenderProps(className)(values)))
      }
    >
      {({ percentage, valueText }) => (
        <>
          <BarIndicatorLabels label={props.label} value={valueText} />
          <BarIndicatorMeter>
            <BarIndicatorProgress style={{ width: percentage + "%" }} />
          </BarIndicatorMeter>
        </>
      )}
    </ProgressBar>
  );
};

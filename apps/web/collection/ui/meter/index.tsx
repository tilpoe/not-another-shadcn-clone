"use client";

import { Meter as RaMeter } from "react-aria-components";

import {
  BarIndicatorLabels,
  BarIndicatorMeter,
  BarIndicatorProgress,
  barIndicatorVariants,
} from "@/collection/ui/bar-indicator";
import { cn, withRenderProps } from "@/lib/utils";

export type MeterProps = React.ComponentPropsWithRef<typeof RaMeter> & {
  label?: string;
};

export const Meter = ({ className, ...props }: MeterProps) => {
  return (
    <RaMeter
      {...props}
      className={(values) =>
        cn(barIndicatorVariants.root(), withRenderProps(className)(values))
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
    </RaMeter>
  );
};

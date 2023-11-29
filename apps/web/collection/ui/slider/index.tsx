"use client";

import { Fragment } from "react";
import {
  Slider as RaSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

import {
  BarIndicatorLabels,
  BarIndicatorProgress,
  barIndicatorVariants,
} from "@/collection/ui/bar-indicator";
import type { FormComponentBaseProps } from "@/collection/ui/form";
import { Description, ErrorMessage } from "@/collection/ui/form";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

export type SliderProps = FormComponentBaseProps &
  React.ComponentPropsWithRef<typeof RaSlider> & {
    thumbLabels?: string[];
  };

export const Slider = autoRef(
  ({
    className,
    label,
    thumbLabels,
    description,
    errorMessage,
    ...props
  }: SliderProps) => {
    return (
      <RaSlider
        className={(values) =>
          cn(barIndicatorVariants.root(), withRenderProps(className)(values))
        }
        {...props}
      >
        <BarIndicatorLabels
          label={label}
          value={
            <SliderOutput>
              {({ state }) =>
                state.values
                  .map((_, i) => state.getThumbValueLabel(i))
                  .join(" – ")
              }
            </SliderOutput>
          }
        />
        <SliderTrack className={barIndicatorVariants.meter()}>
          {({ state }) => (
            <>
              {state.values.length === 1 && (
                <BarIndicatorProgress
                  style={{ width: state.getThumbPercent(0) * 100 + "%" }}
                />
              )}
              {state.values.length > 1 && (
                <BarIndicatorProgress
                  style={{
                    width: `${
                      state.getThumbPercent(state.values.length - 1) * 100 -
                      state.getThumbPercent(0) * 100
                    }%`,
                    left: `${state.getThumbPercent(0) * 100}%`,
                  }}
                />
              )}
              {state.values.map((_, i) => (
                <Fragment key={i}>
                  <SliderThumb
                    className={cn(
                      "dragging:bg-muted top-[50%] h-5 w-5 rounded-full border-2 border-solid border-primary bg-white outline-none ring-primary transition focus-visible:ring-2",
                    )}
                    key={i}
                    index={i}
                    aria-label={thumbLabels?.[i]}
                  />
                </Fragment>
              ))}
            </>
          )}
        </SliderTrack>
        <Description>{description}</Description>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </RaSlider>
    );
  },
);

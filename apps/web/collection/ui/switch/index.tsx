"use client";

import { cva } from "cva";
import { Switch as RaSwitch } from "react-aria-components";

import type { FormComponentBaseProps } from "@/collection/ui/form";
import { Description, ErrorMessage, Label } from "@/collection/ui/form";
import { useFormFieldContext } from "@/lib/form/context";
import { useCustomAriaIds } from "@/lib/form/utils";
import { autoRef, cn, withRenderProps } from "@/lib/utils";

export const switchVariants = {
  wrapper: cva({
    base: cn("group/wrapper flex flex-col gap-2"),
  }),
  componentWrapper: cva({
    base: cn("flex items-center gap-2"),
  }),
  indicatorWrapper: cva({
    base: cn(
      "box-border flex h-[26px] w-[44px] shrink-0 cursor-default rounded-full border border-solid border-white/30 bg-input bg-clip-padding p-[3px] shadow-inner outline-none ring-black transition duration-200 ease-in-out",
      "group-s-pressed/wrapper:bg-primary/20 group-s-selected/wrapper:bg-primary group-s-selected/wrapper:group-pressed:bg-primary/20 group-s-focus/wrapper-visible:ring-2 ",
    ),
  }),
  indicator: cva({
    base: cn(
      "h-[18px] w-[18px] translate-x-0 rounded-full bg-white shadow transition duration-200 ease-in-out",
      "group-s-selected/wrapper:translate-x-[100%]",
    ),
  }),
};

export type SwitchProps = FormComponentBaseProps &
  React.ComponentPropsWithRef<typeof RaSwitch>;

export const Switch = autoRef(
  ({ className, label, description, errorMessage, ...props }: SwitchProps) => {
    const formField = useFormFieldContext();
    const { error, descriptionId, errorId, describedBy } = useCustomAriaIds({
      description,
      errorOrErrorMessage: formField?.error?.message ?? errorMessage,
    });

    return (
      <RaSwitch
        className={(values) =>
          cn(switchVariants.wrapper(), withRenderProps(className)(values))
        }
        aria-describedby={describedBy}
        {...props}
      >
        <div className={switchVariants.componentWrapper()}>
          <div className={switchVariants.indicatorWrapper()}>
            <span className={switchVariants.indicator()} />
          </div>
          <div className="flex flex-col">
            {label && (
              <Label as="child">
                <span>{label}</span>
              </Label>
            )}
            <Description id={descriptionId} aria-hidden="true">
              {description}
            </Description>
            <ErrorMessage id={errorId}>{error}</ErrorMessage>
          </div>
        </div>
      </RaSwitch>
    );
  },
);

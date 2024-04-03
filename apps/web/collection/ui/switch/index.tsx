import { Switch as RACSwitch } from "react-aria-components";
import { tv } from "tailwind-variants";

import type { FieldProps } from "@/collection/ui/field";
import { Description, FieldError, Label } from "@/collection/ui/field";
import { useCustomAriaIds, useFieldState } from "@/lib/form-v2";
import { autoRef, composeClassName, focusRing } from "@/lib/ui";

const switchIndicatorWrapperVariants = tv({
  extend: focusRing,
  base: "box-border flex h-[26px] w-[44px] shrink-0 rounded-full border border-white/30 bg-input bg-clip-padding p-[3px] shadow-inner outline-none transition duration-200 ease-in-out",
  variants: {
    isSelected: {
      true: "bg-primary",
    },
    isPressed: {
      true: "bg-primary/20",
    },
  },
});

const switchIndicatorVariants = tv({
  base: "h-[18px] w-[18px] translate-x-0 rounded-full bg-white shadow transition duration-200 ease-in-out",
  variants: {
    isSelected: {
      true: "translate-x-[100%]",
    },
  },
});

export type SwitchProps = Omit<FieldProps, "onPressEnter" | "placeholder"> &
  React.ComponentPropsWithRef<typeof RACSwitch>;

export const Switch = autoRef(
  ({ className, label, description, errorMessage, ...props }: SwitchProps) => {
    const formField = useFieldState();

    const { error, descriptionId, errorId, describedBy } = useCustomAriaIds({
      description,
      errorOrErrorMessage: formField?.error?.message ?? errorMessage,
    });

    return (
      <RACSwitch
        {...props}
        className={composeClassName(className, "flex flex-col gap-2")}
        aria-describedby={describedBy}
      >
        {({ isPressed, isSelected, isFocusVisible }) => (
          <>
            <div className="flex items-center gap-2">
              <div
                className={switchIndicatorWrapperVariants({
                  isSelected,
                  isPressed,
                  isFocusVisible,
                })}
              >
                <span className={switchIndicatorVariants({ isSelected })} />
              </div>
              <div className="flex flex-col">
                <Label as="child">
                  <span>{label}</span>
                </Label>
                <Description id={descriptionId} aria-hidden="true">
                  {description}
                </Description>
                <FieldError id={errorId}>{error}</FieldError>
              </div>
            </div>
          </>
        )}
      </RACSwitch>
    );
  },
);

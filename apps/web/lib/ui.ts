import type { ForwardedRef, ReactElement } from "react";
import { forwardRef } from "react";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */
export const focusRing = tv({
  base: "outline outline-ring outline-offset-2 outline-0 focus-visible:outline-2",
});

export const formWrapperVariants = tv({
  base: "grid gap-y-1",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}

interface AutoRefFunction {
  (props: any): ReactElement | null;
  displayName?: string;
}

export function autoRef<
  Fn extends AutoRefFunction,
  Props extends { ref?: RefType },
  RefType,
>(fn: Fn) {
  const AutoRef = (props: Props, ref: ForwardedRef<RefType>) =>
    fn({ ...props, ref });
  AutoRef.displayName = fn.displayName || fn.name || "AutoRef";
  return forwardRef(AutoRef) as unknown as Fn;
}

export function withRenderProps<
  TReturn extends React.ReactNode | string,
  TRenderProps,
>(
  prop: TReturn | ((values: TRenderProps) => TReturn),
): (values: TRenderProps) => TReturn {
  return (values: TRenderProps) =>
    typeof prop === "function" ? prop(values) : prop;
}

export function composeClassName<U>(
  classNameProp: string | ((v: U) => string) | undefined,
  add: string | ((prevValue: string | undefined, renderProps: U) => string),
) {
  return composeRenderProps(classNameProp, (className, renderProps) => {
    if (typeof add === "function") {
      return add(className, renderProps);
    } else {
      return twMerge(add, className);
    }
  });
}

export function mergeRefs<T = any>(
  refs: (React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null)[],
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

import type { ForwardedRef, ReactElement, SyntheticEvent } from "react";
import { forwardRef } from "react";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * An alternative to the standard reduce function that infers the type of the initial value from
 * the given array type.
 * @param array The array to reduce.
 * @param init The initial value of the accumulator.
 * @param callbackFn The function to execute on each element in the array.
 * @returns The reduced value.
 */
export function reduce<T>(
  array: T[],
  init: T[],
  callbackFn: (acc: T[], curr: T) => T[],
) {
  return array.reduce<T[]>(callbackFn, init);
}

/**
 * Reduces a record of arrays into a record of reduced values.
 *
 * @template T The type of the items in the input arrays.
 * @template R The type of the reduced values.
 * @param {Record<string, T[]>} record The input record of arrays.
 * @param {(item: T) => R} init The function to initialize the reduced value.
 * @param {(acc: R, item: T) => R} reduce The function to reduce the items in the array.
 * @returns {Record<string, R>} The record of reduced values.
 */
export function reduceRecord<T, R>(
  record: Record<string, T[]>,
  init: (item: T) => R,
  reduce: (acc: R, item: T) => R,
): Record<string, R> {
  const result: Record<string, R> = {};
  for (const [key, value] of Object.entries(record)) {
    for (const item of value) {
      if (!(key in result)) {
        result[key] = init(item);
      } else {
        result[key] = reduce(result[key]!, item);
      }
    }
  }
  return result;
}

/**
 * Reduces the values of a Map by key, applying an initial value and a reducer function.
 * @param map The Map to reduce.
 * @param init The initial value to apply to each key.
 * @param reduce The reducer function to apply to each value of each key.
 * @returns A new Map with the reduced values.
 */
export function reduceMap<T, R>(
  map: Map<string, T[]>,
  init: (item: T) => R,
  reduce: (acc: R, item: T) => R,
): Map<string, R> {
  const result = new Map<string, R>();
  for (const [key, value] of map.entries()) {
    for (const item of value) {
      if (!result.has(key)) {
        result.set(key, init(item));
      }

      result.set(key, reduce(result.get(key)!, item));
    }
  }
  return result;
}

/**
 * Groups the items in an array based on the result of a callback function.
 * @param items The array of items to group.
 * @param callbackFn The callback function used to determine the group for each item.
 * @returns An object with keys representing the groups and values representing the items in each group.
 */
export function group<T>(items: T[], callbackFn: (item: T) => string) {
  const groups: Record<string, T[]> = {};

  items.forEach((item) => {
    const group = callbackFn(item);
    groups[group] = groups[group] ?? [];
    groups[group]?.push(item);
  });

  return groups;
}
/**
 * Rounds a number to a specified number of digits after the decimal point.
 * @param num - The number to round.
 * @param digits - The number of digits after the decimal point to round to. Defaults to 2.
 * @returns The rounded number.
 */

export const round = (num: number, digits = 2) => {
  return (
    Math.round((num + Number.EPSILON) * Math.pow(10, digits)) /
    Math.pow(10, digits)
  );
};
/**
 * Formats a price as a string with an optional euro symbol.
 * @param price - The price to format.
 * @param options - An optional object with a `withEuro` property indicating whether to include the euro symbol.
 * @returns The formatted price as a string.
 */

export const priceAsString = (
  price?: number,
  options?: {
    withEuro?: boolean;
  },
) => {
  if (price === undefined) return "?? €";
  return (
    round(price).toFixed(2).replace(".", ",") + (options?.withEuro ? "€" : "")
  );
};

export const formatMoney = (amount: number | { amount: number }) => {
  if (typeof amount === "number") {
    return priceAsString(amount / 100, { withEuro: true });
  } else {
    return priceAsString(amount.amount / 100, { withEuro: true });
  }
};
/**
 * Delays the execution of the function by the specified amount of time.
 * @param ms - The number of milliseconds to delay the execution.
 * @returns A promise that resolves after the specified delay.
 */

export function sleep(ms = 3000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Formats a total number of seconds into a string representation of hours, minutes, and seconds.
 * @param totalSeconds - The total number of seconds to format.
 * @returns A string representation of the total number of seconds in the format "HH:MM:SS".
 */

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

/**
 * This is a hack to get around the fact that TS doesn't allow you to infer a const type.
 * @param array - A readonly array of strings to infer the type from.
 * @param item - The item of the array to return.
 * @param asString - If true, the return type will be a string. Otherwise, it will be the array item constant.
 * @returns The array item constant or a string.
 *
 * @example
 * const array = ["a", "b", "c"] as const;
 * const item = inferConst(array, "b"); // item is "b" with type "b"
 * const item = inferConst(array, "b", true); // item is "b" with type string
 */

export const inferConst = <
  TArray extends readonly string[],
  TKey extends TArray[number],
  TAsString extends boolean = false,
>(
  array: TArray,
  item: TKey,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asString?: TAsString,
): TAsString extends true ? string : TKey => item;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStackTrace(maxDepth = 8) {
  try {
    throw new Error();
  } catch (e) {
    if (
      e !== null &&
      typeof e === "object" &&
      "stack" in e &&
      typeof e.stack === "string"
    ) {
      // split the stack into lines
      const lines = e.stack.split("\n");

      // first line is "Error" -> remove it
      lines.shift();

      // every line begins with space and then "at" -> remove it
      let i = 0;

      const functions: string[] = [];
      for (const line of lines) {
        if (i > maxDepth - 1) {
          break;
        }
        const tokens = line.trim().split(" ");
        if (tokens[0] === "at" && tokens.length > 1) {
          tokens.shift();
        }
        functions.push(tokens[0]!);
        i++;
      }

      return functions;
    }
  }

  return [];
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

export function transformToImageEvent(
  e: SyntheticEvent<HTMLImageElement, Event>,
) {
  let width = 0;
  let height = 0;

  if ("naturalWidth" in e.target && typeof e.target.naturalWidth === "number") {
    width = e.target.naturalWidth;
  }

  if (
    "naturalHeight" in e.target &&
    typeof e.target.naturalHeight === "number"
  ) {
    height = e.target.naturalHeight;
  }

  return {
    ...e,
    target: {
      ...e.target,
      width,
      height,
    },
  };
}

import type { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";

/**
 * This variable is needed because the zustand/immer types don't work properly for whatever reason.
 */

const _IGNORE = immer;

/**
 * Add immer middleware to zustand slice.
 */
export type Slice<T> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  T
>;

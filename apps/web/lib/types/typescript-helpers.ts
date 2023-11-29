/**
 * Gets the type of a single array element.
 *
 * @example
 * type Item = ArrayItem<string[]>;
 * // Item is now string
 */
export type ArrayItem<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Infers the value type of a record or map.
 */
export type InferValue<TKeyValue> = TKeyValue extends Map<unknown, infer TValue>
  ? TValue
  : TKeyValue extends Record<string, infer TValue>
    ? TValue
    : never;

/**
 * Extends an array with an item of the given type.
 *
 * @example
 * type MyArray = ExtendArray<string[], { foo: string }>;
 * // MyArray is now (string & { foo: string })[]
 */
export type ExtendArray<BaseArray, AppendedObject> = BaseArray extends Iterable<
  infer ArrayItem
>
  ? AppendedObject extends object
    ? (ArrayItem & AppendedObject)[]
    : never
  : never;

/**
 * Infers the type of the resolved value of a Promise.
 *
 * @template T - The type of the Promise.
 * @returns The type of the resolved value of the Promise.
 *
 * @deprecated Use Awaited<T> instead.
 */
export type InferPromise<T> = T extends Promise<infer U> ? U : never;

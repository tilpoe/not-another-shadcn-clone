/**
 * Helper for getting the return type of a kysely query.
 *
 * @example
 * const query = client.selectFrom("table").select(["table.foo"])
 * type Rows = FetchedRows<typeof query>;
 *
 * // Rows is now { foo: string }[]
 */
export type FetchedRows<
  T extends (...any: any[]) => { ["expressionType"]: any },
> = NonNullable<ReturnType<T>["expressionType"]>[];

/**
 * This is a forked version of the next-safe-action package.
 * See original source here: https://github.com/TheEdoRan/next-safe-action
 * The original package is licensed under the MIT license.
 */

import { isNotFoundError } from "next/dist/client/components/not-found";
import { isRedirectError } from "next/dist/client/components/redirect";
import type { z } from "zod";

import {
  BetterActionError,
  DEFAULT_SERVER_ERROR,
  isError,
} from "@/lib/actions/utils";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */
/**
 * Type of the function called from Client Components with typesafe input data.
 */
export type SafeAction<
  Schema extends z.ZodTypeAny,
  Data,
  BetterActionErrors extends readonly string[],
> = (input: z.input<Schema>) => Promise<{
  data?: Data;
  serverError?: string;
  validationError?: Partial<Record<keyof z.input<Schema> | "_root", string[]>>;
  actionError?: BetterActionErrors[number];
}>;

/**
 * Type of the function that executes server code when defining a new safe action.
 */
export type ServerCode<
  Schema extends z.ZodTypeAny,
  Data,
  Context,
  BetterActionErrors extends readonly string[],
> = (options: {
  input: z.infer<Schema>;
  ctx: Context;
  error: (e: BetterActionErrors[number]) => void;
}) => Promise<Data>;

// HOOKS

/**
 * Type of `result` object returned by `useAction` and `useOptimisticAction` hooks.
 */
export type HookResult<
  Schema extends z.ZodTypeAny,
  Data,
  BetterActionErrors extends readonly string[],
> = Awaited<ReturnType<SafeAction<Schema, Data, BetterActionErrors>>> & {
  fetchError?: string;
};

/**
 * Type of hooks callbacks. These are executed when action is in a specific state.
 */
export interface HookCallbacks<
  Schema extends z.ZodTypeAny,
  Data,
  BetterActionErrors extends readonly string[],
> {
  onExecute?: (input: z.input<Schema>) => MaybePromise<void>;
  onSuccess?: (
    data: Data,
    input: z.input<Schema>,
    reset: () => void,
  ) => MaybePromise<void>;
  onError?: (
    error: Omit<HookResult<Schema, Data, BetterActionErrors>, "data">,
    input: z.input<Schema>,
    reset: () => void,
  ) => MaybePromise<void>;
  onSettled?: (
    result: HookResult<Schema, Data, BetterActionErrors>,
    input: z.input<Schema>,
    reset: () => void,
  ) => MaybePromise<void>;
}

/**
 * Type of the action status returned by `useAction` and `useOptimisticAction` hooks.
 */
export type HookActionStatus =
  | "idle"
  | "executing"
  | "hasSucceeded"
  | "hasErrored";

export type MaybePromise<T> = Promise<T> | T;

/* -------------------------------------------------------------------------- */
/*                                    HOOKS                                   */
/* -------------------------------------------------------------------------- */

export const createBetterActionClient = <
  Context,
  MoreOptions extends Record<string, unknown> = Record<string, never>,
>(createOpts?: {
  handleServerErrorLog?: (e: Error) => MaybePromise<void>;
  handleReturnedServerError?: (
    e: Error,
  ) => MaybePromise<{ serverError: string }>;
  middleware?: (opts: MoreOptions) => MaybePromise<Context>;
}) => {
  // If server log function is not provided, default to `console.error` for logging
  // server error messages.
  const handleServerErrorLog =
    createOpts?.handleServerErrorLog ||
    ((e) => {
      console.error("Action error:", e.message);
    });

  // If `handleReturnedServerError` is provided, use it to handle server error
  // messages returned on the client.
  // Otherwise mask the error and use a generic message.
  const handleReturnedServerError =
    createOpts?.handleReturnedServerError ||
    (() => ({ serverError: DEFAULT_SERVER_ERROR }));

  // `actionBuilder` is the server function that creates a new action.
  // It expects an input schema and a `serverCode` function, so the action
  // knows what to do on the server when called by the client.
  // It returns a function callable by the client.
  const actionBuilder = <
    const Schema extends z.ZodTypeAny,
    const Data,
    const BetterActionErrors extends readonly string[],
  >(
    options: {
      input: Schema;
      errors?: BetterActionErrors;
    } & MoreOptions,
    serverCode: ServerCode<Schema, Data, Context, BetterActionErrors>,
  ): SafeAction<Schema, Data, BetterActionErrors> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { input: schema, errors, ...moreOptions } = options;

    // This is the function called by client. If `input` fails the schema
    // parsing, the function will return a `validationError` object, containing
    // all the invalid fields provided.
    return async (clientInput) => {
      try {
        const parsedInput = await schema.safeParseAsync(clientInput);

        if (!parsedInput.success) {
          const { formErrors, fieldErrors } = parsedInput.error.flatten();

          return {
            validationError: {
              _root: formErrors.length ? formErrors : undefined,
              ...fieldErrors,
            } as Partial<Record<keyof z.input<Schema> | "_root", string[]>>,
          };
        }

        // Get the context if `middleware` is provided.
        const ctx = (await Promise.resolve(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore Arbitrary type cast error -> still works
          createOpts?.middleware?.(moreOptions),
        )) as Context;

        // Get `result.data` from the server code function. If it doesn't return
        // anything, `data` will be `null`.
        const data = ((await serverCode({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          input: parsedInput.data,
          ctx,
          error: (e: BetterActionErrors[number]) => {
            throw new BetterActionError(e);
          },
        })) ?? null) as Data;

        return { data };
      } catch (e: unknown) {
        // next/navigation functions work by throwing an error that will be
        // processed internally by Next.js. So, in this case we need to rethrow it.
        if (isRedirectError(e) || isNotFoundError(e)) {
          throw e;
        }

        if (e instanceof BetterActionError) {
          const reason = e.getReason() as BetterActionErrors[number];
          return {
            serverError: undefined,
            actionError: reason,
          };
        }

        // If error cannot be handled, warn the user and return a generic message.
        if (!isError(e)) {
          console.warn(
            "Could not handle server error. Not an instance of Error: ",
            e,
          );
          return { serverError: DEFAULT_SERVER_ERROR };
        }

        await Promise.resolve(handleServerErrorLog(e));

        return await Promise.resolve(handleReturnedServerError(e));
      }
    };
  };

  return <
    Schema extends z.ZodTypeAny,
    const BetterActionErrors extends readonly string[],
  >(
    input: Schema,
    options?: { errors?: BetterActionErrors } & MoreOptions,
  ) => {
    return <const Data>(
      serverCode: ServerCode<Schema, Data, Context, BetterActionErrors>,
    ) => {
      return actionBuilder(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Arbitrary type cast error -> still works
        {
          input: input,
          ...options,
        },
        serverCode,
      );
    };
  };
};

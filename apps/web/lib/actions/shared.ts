/**
 * This is a forked version of the next-safe-action package.
 * See original source here: https://github.com/TheEdoRan/next-safe-action
 * The original package is licensed under the MIT license.
 */

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
// @ts-expect-error Should be fixed in latest version of Next
import type { RedirectError } from "next/dist/client/components/error";
import { z } from "zod";

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
  validationError?: Partial<Record<keyof z.input<Schema>, string[]>>;
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
/*                                    UTILS                                   */
/* -------------------------------------------------------------------------- */

export const DEFAULT_SERVER_ERROR =
  "Something went wrong while executing the operation";

const REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
const NOT_FOUND_ERROR_CODE = "NEXT_NOT_FOUND";

export type NotFoundError = Error & { digest: typeof NOT_FOUND_ERROR_CODE };

export const isNextRedirectError = <U extends string>(
  error: any,
): error is RedirectError<U> => {
  if (!z.object({ digest: z.string() }).safeParse(error).success) {
    return false;
  }

  const [errorCode, type, destination, permanent] =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (error.digest as string).split(";", 4);

  if (!errorCode || !type || !destination || !permanent) {
    return false;
  }

  return (
    errorCode === REDIRECT_ERROR_CODE &&
    (type === "replace" || type === "push") &&
    typeof destination === "string" &&
    (permanent === "true" || permanent === "false")
  );
};

export const isNextNotFoundError = (error: any): error is NotFoundError =>
  z.object({ digest: z.literal(NOT_FOUND_ERROR_CODE) }).safeParse(error)
    .success;

export const isError = (error: any): error is Error => error instanceof Error;

/* -------------------------------------------------------------------------- */
/*                                    ERROR                                   */
/* -------------------------------------------------------------------------- */

export class BetterActionError<Errors extends readonly string[]> extends Error {
  private reason: Errors[number];

  constructor(message: Errors[number]) {
    super(message);
    this.reason = message;
  }

  getReason() {
    return this.reason;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    HOOK                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_RESULT: HookResult<z.ZodTypeAny, any, []> = {
  data: undefined,
  serverError: undefined,
  validationError: undefined,
  fetchError: undefined,
  actionError: undefined,
};

const getActionStatus = <
  const Schema extends z.ZodTypeAny,
  const Data,
  const BetterActionErrors extends readonly string[],
>(
  isExecuting: boolean,
  result: HookResult<Schema, Data, BetterActionErrors>,
): HookActionStatus => {
  if (isExecuting) {
    return "executing";
  } else if (typeof result.data !== "undefined") {
    return "hasSucceeded";
  } else if (
    typeof result.validationError !== "undefined" ||
    typeof result.serverError !== "undefined" ||
    typeof result.fetchError !== "undefined" ||
    typeof result.actionError !== "undefined"
  ) {
    return "hasErrored";
  }

  return "idle";
};

const useActionCallbacks = <
  const Schema extends z.ZodTypeAny,
  const Data,
  const BetterActionErrors extends readonly string[],
>(
  result: HookResult<Schema, Data, BetterActionErrors>,
  input: z.input<Schema>,
  status: HookActionStatus,
  reset: () => void,
  cb?: HookCallbacks<Schema, Data, BetterActionErrors>,
) => {
  const onExecuteRef = useRef(cb?.onExecute);
  const onSuccessRef = useRef(cb?.onSuccess);
  const onErrorRef = useRef(cb?.onError);
  const onSettledRef = useRef(cb?.onSettled);

  // Execute the callback on success or error, if provided.
  useEffect(() => {
    const onExecute = onExecuteRef.current;
    const onSuccess = onSuccessRef.current;
    const onError = onErrorRef.current;
    const onSettled = onSettledRef.current;

    const executeCallbacks = async () => {
      switch (status) {
        case "executing":
          await Promise.resolve(onExecute?.(input));
          break;
        case "hasSucceeded":
          await Promise.resolve(onSuccess?.(result.data!, input, reset));
          await Promise.resolve(onSettled?.(result, input, reset));
          break;
        case "hasErrored":
          await Promise.resolve(onError?.(result, input, reset));
          await Promise.resolve(onSettled?.(result, input, reset));
          break;
      }
    };

    executeCallbacks().catch(console.error);
  }, [status, result, reset, input]);
};

export const useBetterAction = <
  const Schema extends z.ZodTypeAny,
  const Data,
  const BetterActionErrors extends readonly string[],
>(
  safeAction: SafeAction<Schema, Data, BetterActionErrors>,
  callbacks?: HookCallbacks<Schema, Data, BetterActionErrors>,
) => {
  const [, startTransition] = useTransition();
  const executor = useRef(safeAction);
  const [result, setResult] =
    useState<HookResult<Schema, Data, BetterActionErrors>>(DEFAULT_RESULT);
  const [input, setInput] = useState<z.input<Schema>>();
  const [isExecuting, setIsExecuting] = useState(false);

  const status = getActionStatus<Schema, Data, BetterActionErrors>(
    isExecuting,
    result,
  );

  const execute = useCallback((input: z.input<Schema>) => {
    setInput(input);
    setIsExecuting(true);

    return startTransition(() => {
      return executor
        .current(input)
        .then((res) => setResult(res ?? DEFAULT_RESULT))
        .catch((e) => {
          if (isNextRedirectError(e) || isNextNotFoundError(e)) {
            throw e;
          }

          setResult({
            fetchError: isError(e) ? e.message : "Something went wrong",
          });
        })
        .finally(() => {
          setIsExecuting(false);
        });
    });
  }, []);

  const executeAsync = useCallback(
    async (
      input: z.input<Schema>,
    ): Promise<
      | {
          ok: true;
          data: Data;
          input: Schema;
        }
      | {
          ok: false;
          actionError: BetterActionErrors[number] | undefined;
          serverError: string | undefined;
        }
    > => {
      setInput(input);
      setIsExecuting(true);

      try {
        const res = await executor.current(input);

        if (res.data) {
          setResult(res);
          setIsExecuting(false);
          return {
            ok: true,
            data: res.data,
            input,
          };
        } else {
          setResult(res);
          setIsExecuting(false);
          return {
            ok: false,
            actionError: res.actionError,
            serverError: res.serverError,
          };
        }
      } catch (e) {
        if (isNextRedirectError(e) || isNextNotFoundError(e)) {
          throw e;
        }

        setResult({
          fetchError: isError(e) ? e.message : "Something went wrong",
        });

        setIsExecuting(false);
        return {
          ok: false,
          actionError: undefined,
          serverError: isError(e) ? e.message : "Something went wrong",
        };
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResult(DEFAULT_RESULT);
  }, []);

  useActionCallbacks(result, input, status, reset, callbacks);

  return {
    execute,
    executeAsync,
    result,
    reset,
    status,
    hasSucceeded: status === "hasSucceeded",
    hasErrored: status === "hasErrored",
    hasSettled: status === "hasErrored" || status === "hasSucceeded",
    isExecuting,
    isIdle: status === "idle",
  };
};

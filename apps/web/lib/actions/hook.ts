"use client";

/**
 * This is a forked version of the next-safe-action package.
 * See original source here: https://github.com/TheEdoRan/next-safe-action
 * The original package is licensed under the MIT license.
 */
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { isRedirectError } from "next/dist/client/components/redirect";
import type { z } from "zod";

import type {
  HookActionStatus,
  HookCallbacks,
  HookResult,
  SafeAction,
} from "@/lib/actions";
import { isError } from "@/lib/actions/utils";

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

  // Execute the callback when the action status changes.
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
  const [result, setResult] =
    useState<HookResult<Schema, Data, BetterActionErrors>>(DEFAULT_RESULT);
  const [input, setInput] = useState<z.input<Schema>>();
  const [isExecuting, setIsExecuting] = useState(false);

  const status = getActionStatus<Schema, Data, BetterActionErrors>(
    isExecuting,
    result,
  );

  const execute = useCallback(
    (input: z.input<Schema>) => {
      setInput(input);
      setIsExecuting(true);

      return startTransition(() => {
        return safeAction(input)
          .then((res) => setResult(res ?? DEFAULT_RESULT))
          .catch((e) => {
            if (isRedirectError(e) || isNotFoundError(e)) {
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
    },
    [safeAction],
  );

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
        const res = await safeAction(input);

        if (res.data !== undefined) {
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
        if (isRedirectError(e) || isNotFoundError(e)) {
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
    [safeAction],
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

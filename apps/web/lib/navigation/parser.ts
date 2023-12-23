import { useParams, useSearchParams } from "next/navigation";
import type { z } from "zod";

import type { NextRoute } from "@/lib/navigation/utils";
import { redirect } from "@/lib/navigation/utils";

interface ParseOptions<TSchema extends z.ZodType> {
  schema: TSchema;
}

/* -------------------------------------------------------------------------- */
/*                                   Server                                   */
/* -------------------------------------------------------------------------- */

/**
 * Parses the search params of the current route (server-side).
 */
export const parseSearchParams = <
  TSchema extends z.ZodType,
  TRoute,
  TRedirectTo extends NextRoute<TRoute> | undefined,
>(
  unparsedSearchParams: unknown,
  options: ParseOptions<TSchema> & {
    redirectTo?: TRedirectTo;
  },
): TRedirectTo extends string
  ? TSchema["_input"]
  : TSchema["_input"] | null => {
  const params = options.schema.safeParse(unparsedSearchParams);

  if (!params.success) {
    if (options.redirectTo) {
      redirect(options.redirectTo as NextRoute<TRoute>);
    }

    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return params.data as TSchema["_input"];
};

/* -------------------------------------------------------------------------- */
/*                                Client Hooks                                */
/* -------------------------------------------------------------------------- */

/**
 * Parses the dynamic params of the current route (client-side).
 */
export function useParseParams<TSchema extends z.ZodType>(schema: TSchema) {
  const unparsedParams = useParams();

  if (!unparsedParams) {
    throw new Error("useParseParams: No params.");
  }

  const params = schema.safeParse(unparsedParams);

  if (!params.success) {
    throw new Error("useParseSearchParams: Invalid search params.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return params.data as TSchema["_output"];
}

/**
 * Parses the search params of the URL (client-side).
 */
export function useParseSearchParams<TSchema extends z.ZodType>(
  schema: TSchema,
) {
  const searchParamsObject = useSearchParams();

  if (!searchParamsObject) {
    throw new Error("useParseSearchParams: No search params.");
  }

  const unparsedSearchParams: Record<string, string> = {};
  for (const [key, value] of searchParamsObject.entries()) {
    unparsedSearchParams[key] = value;
  }

  const searchParams = schema.safeParse(unparsedSearchParams);

  if (!searchParams.success) {
    throw new Error("useParseSearchParams: Invalid search params.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return searchParams.data as TSchema["_output"];
}

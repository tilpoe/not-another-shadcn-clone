import type { Route } from "next";
import type { LinkProps } from "next/link";
import { redirect as nextRedirect } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                    ROUTE                                   */
/* -------------------------------------------------------------------------- */

type InferRoutes<T> = T extends {
  href: infer H;
}
  ? H
  : never;

export type NextRoute<TRoute> = InferRoutes<LinkProps<TRoute>>;

/**
 * Alias for the default `next/navigation` redirect function, but with a type-safe `href` parameter.
 */
export function redirect<TRoute>(href: NextRoute<TRoute>): never {
  return nextRedirect(href as string);
}

/**
 * Helper to assign a route to a variable in a type-safe way.
 */
export const route = <RouteType>(
  href: NextRoute<RouteType>,
  searchParams?: Record<string, string>,
) => {
  let result = href as string;
  if (searchParams) {
    const search = new URLSearchParams(searchParams).toString();
    result = `${result}?${search}`;
  }
  return result as Route;
};

/**
 * Same as "route" but returns a string instead of a Next.js route object.
 */
export const routeAsString = <RouteType>(
  href: NextRoute<RouteType>,
  searchParams?: Record<string, string>,
) => {
  return route(href, searchParams) as string;
};

/**
 * Checks if a given string matches a next route. The special thing is
 * that you can check against dynamic routes.
 *
 * @example
 * const route = "/users/3/edit";
 * const matches = matchesRoute(route, "/users/[id]/edit");
 * console.log(matches); // true
 */
export function matchesRoute<RouteType>(
  route: string,
  toMatch: NextRoute<RouteType>,
) {
  const pattern = new RegExp(
    `^${(toMatch as string)
      .replace(/\[\.\.\.\w+\]/g, ".+?")
      .replace(/\[[^\]]+\]/g, "[^/]+")}$`,
  );
  return pattern.test(route);
}

/* -------------------------------------------------------------------------- */
/*                                     URL                                    */
/* -------------------------------------------------------------------------- */

/**
 * Parses the search parameters from a URL and returns them as an object.
 * @param url - The URL to parse.
 * @returns An object containing the search parameters.
 */
export function getSearchParamsFromUrl(
  url: string,
): Record<string, string | string[] | undefined> {
  return Object.fromEntries(new URL(url).searchParams);
}

/**
 * Decodes a URL parameter value by decoding it and converting it to lowercase.
 * @param value - The URL parameter value to decode.
 * @returns The decoded and lowercase value.
 */
export function decodeParam(value: string) {
  return decodeURIComponent(value).toLowerCase();
}

/**
 * Encodes a string value for use as a parameter in a URL.
 *
 * @param value - The string value to be encoded.
 * @returns The encoded string value.
 */
export function encodeParam(value: string) {
  return encodeURIComponent(value);
}

/**
 * Creates a query string from the given parameters.
 *
 * @param params - The parameters to be included in the query string.
 * @returns The generated query string.
 */
export function createQueryParams(
  params: Record<string, string | boolean | number>,
): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
    .join("&");
}

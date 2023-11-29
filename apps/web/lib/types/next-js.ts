/**
 * Type for query params in URL, usable in page.tsx or layout.tsx.
 *
 * @example
 * export default function Page({ searchParams }: { searchParams: SearchParams }) {
 *  ...
 * }
 */
export type SearchParams = Record<string, string | string[] | undefined>;

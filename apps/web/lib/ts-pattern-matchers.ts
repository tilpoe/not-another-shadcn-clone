/**
 * Matches the result of a query to one of several possible outcomes.
 *
 * @param queryResult - The result of the query, which includes an array of data and a boolean indicating whether the query is pending.
 * @returns One of the following:
 * - "PENDING" if the query is still pending.
 * - "EMPTY" if the query has completed and the data array is empty.
 * - An object containing the data array if the query has completed and the data array is not empty.
 * - "ERROR" if there was an error with the query.
 *
 * @typeparam T - The type of data in the query result array.
 */
export const matchQuery = <T>(queryResult: {
  data: T[] | undefined;
  isPending: boolean;
}) => {
  const { data, isPending } = queryResult;

  if (isPending) {
    return "PENDING";
  }

  if (data !== undefined && data.length === 0) {
    return "EMPTY";
  }

  if (data !== undefined && data.length > 0) {
    return {
      data,
    };
  }

  return "ERROR";
};

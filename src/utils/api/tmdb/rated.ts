// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

import fetcher from "@/utils/http";
import { IRQRatedMoviesResponse, ITMDBStatusResponse } from ".";

export const ratedMovieQueryKeys = {
  all: ["rated"] as const,
};

/**
 * This function get all the movies rating of a specific account
 *
 * @param accountId - The account identifier
 * @returns All the movies rating
 *
 */
export const getRatedShowsFn = async ({ accountId }: { accountId: number }) => {
  const favIds = await fetcher<IRQRatedMoviesResponse>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/account/session_id_placeholder/rated/${accountId}/movies`,
    {
      method: "GET",
      cache: "no-store"
    },
  );
  return favIds;
};

/**
 * This function add rate to specific movie
 *
 * @param accountId - The account identifier
 * @param rate - A mark out of 10
 * @param showId - The show identifier
 * @returns Boolean that indicate if rating was set correctly
 *
 */
export const setRatedShowsFn = async ({
  showId,
  rate,
  account_id,
}: {
  showId: number;
  rate: number;
  account_id: number;
}) => {
  const shows = await fetcher<ITMDBStatusResponse>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/movie/session_id_placeholder/${account_id}/${showId}/rating`,
    {
      body: JSON.stringify({
        value: rate,
      }),
    },
  );
  return shows.success;
};

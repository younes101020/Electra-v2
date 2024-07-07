import fetcher from "@/utils/http";
import { IRQFavoriteShowResponse, Show } from ".";

// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const favoriteShowQueryKeys = {
  all: ["favorite"] as const,
};

/**
 * This function get all the favorites shows ids of a specific account
 *
 * @param accountId - The account identifier
 * @returns All the favorite shows ids
 *
 */
export const getBookmarkShowsFn = async ({
  accountId,
}: {
  accountId: string;
}) => {
  const favIds = await fetcher<IRQFavoriteShowResponse>(
    `${process.env.NEXT_PUBLIC_BASEURL}/account/${accountId}/favorite/movies`,
    {
      method: "GET",
    },
  );
  return favIds;
};

/**
 * This function set show to account favorite list
 *
 * @param accountId - The account identifier
 * @param showId - The show identifier
 * @returns Boolean that indicate if adding to favorites was done correctly
 *
 */
export const toggleBookmarkShowsFn = async ({
  accountId,
  showId,
  favorite,
}: {
  accountId: string;
  showId: number;
  favorite: boolean;
}) => {
  const shows = await fetcher(
    `${process.env.NEXT_PUBLIC_BASETMDBURL}/account/${accountId}/favorite`,
    {
      body: JSON.stringify({
        media_id: showId,
        media_type: "movie",
        favorite,
      }),
    },
    {
      tmdbContext: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
      },
    },
  );
  return "shows.success";
};

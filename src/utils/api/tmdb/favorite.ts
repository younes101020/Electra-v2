import fetcher from "@/utils/http";
import { IRQFavoriteShowResponse, ITMDBErrorResponse, Show } from ".";

type ITMDBFavoriteMutationResponse = { result: ITMDBErrorResponse };

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
    `${process.env.NEXT_PUBLIC_BASEURL}/api/account/session_id_placeholder/favorite/movies`,
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
  showId,
  favorite,
}: {
  showId: number;
  favorite: boolean;
}) => {
  const shows = await fetcher<ITMDBFavoriteMutationResponse>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/account/session_id_placeholder/favorite/movies`,
    {
      body: JSON.stringify({
        media_id: showId,
        media_type: "movie",
        favorite,
      }),
    },
  );
  return shows.result;
};

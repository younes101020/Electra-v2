import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { unstable_cache } from "next/cache";

/**
 * This endpoint returns a list of ids, each id is related to a specific movie that has been added to favorites
 * Only one information is requested and this is the account id where we will retrieve the ids movie that have been added to favorites
 *
 * Note: The favorite ids movie is cached indefinitely
 */
export async function GET({ params }: { params: { accountid: string } }) {
  try {
    const favIds = await getCachedFavoriteMovieIds(params.accountid);
    return Response.json(favIds);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

const getCachedFavoriteMovieIds = async (accountId: string) =>
  unstable_cache(
    async (accountId) => getFavoriteMovieIds(accountId),
    [accountId],
    { tags: [accountId, "favorite"] },
  );

const getFavoriteMovieIds = async (accountId: string) => {
  try {
    const favShows = await fetcher<ITMDBShowResponse>(
      `${process.env.NEXT_PUBLIC_BASETMDBURL}/account/${accountId}/favorite/movies`,
      {
        method: "GET",
      },
      {
        tmdbContext: {
          api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
        },
      },
    );
    const favIds = favShows.results.map((show) => show.id);
    return { ...favShows, results: favIds };
  } catch (error) {
    throw error;
  }
};

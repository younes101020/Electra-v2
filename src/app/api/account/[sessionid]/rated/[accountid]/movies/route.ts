import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { unstable_cache } from "next/cache";

/**
 * This endpoint returns all the ratings that a specific user has assigned to a range of movies
 *
 * Note: All the returned ratings is cached and will be invalidate on each user movie rating mutation
 */
export async function GET(
  request: Request,
  { params }: { params: { sessionid: string; accountid: string } },
) {
  try {
    console.log("GET:", [`rated:${params.accountid}`])
    const moviesRating = await getCachedMoviesRating(
      params.sessionid,
      params.accountid,
    );
    return Response.json(moviesRating);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error }, { status: 502 });
  }
}

const getCachedMoviesRating = async (sessionid: string, accountId: string) => {
  const cachedMoviesRating = unstable_cache(
    async (accountId) => getMoviesRating(sessionid, accountId),
    [accountId],
    { tags: [`rated:${accountId}`] },
  );
  const favs = await cachedMoviesRating(accountId);
  return favs;
};

const getMoviesRating = async (sessionid: string, accountId: string) => {
  try {
    const moviesRating = await fetcher<ITMDBShowResponse>(
      `${process.env.BASETMDBURL}/account/${accountId}/rated/movies`,
      {
        method: "GET",
      },
      {
        tmdbContext: {
          session_id: sessionid,
        },
      },
    );
    return moviesRating;
  } catch (error) {
    throw error;
  }
};

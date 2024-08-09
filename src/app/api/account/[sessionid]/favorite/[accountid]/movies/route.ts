import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { revalidateTag, unstable_cache } from "next/cache";

/**
 * This endpoint returns a list of ids, each id is related to a specific movie that has been added to favorites
 *
 * Note: The favorite ids movie is cached indefinitely
 */
export async function GET(
  request: Request,
  { params }: { params: { sessionid: string; accountid: string } },
) {
  try {
    const favIds = await getCachedFavoriteMovieIds(
      params.sessionid,
      params.accountid,
    );
    return Response.json(favIds);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error }, { status: 502 });
  }
}

const getCachedFavoriteMovieIds = async (
  sessionid: string,
  accountId: string,
) => {
  const cachedFavs = unstable_cache(
    async (accountId) => getFavoriteMovieIds(sessionid, accountId),
    [accountId],
    { tags: [accountId, "favorite"] },
  );
  const favs = await cachedFavs(accountId);
  return favs;
};

const getFavoriteMovieIds = async (sessionid: string, accountId: string) => {
  try {
    const favShows = await fetcher<ITMDBShowResponse>(
      `${process.env.BASETMDBURL}/account/${accountId}/favorite/movies`,
      {
        method: "GET",
      },
      {
        tmdbContext: {
          api_key: process.env.TMDB_API_KEY!,
          session_id: sessionid,
        },
      },
    );
    console.log(`${process.env.BASETMDBURL}/account/${accountId}/favorite/movies`, "GET");
    const favIds = favShows.results.map((show) => show.id);
    return { ...favShows, results: favIds };
  } catch (error) {
    throw error;
  }
};

/**
 * This endpoint remove/add movies to favorite
 * Three thing are required inside the body: `media_id`, `media_type` and a boolean which indicates whether or not we should include the content to the favorite
 *
 * Note: user favorite cache is reset each time this endpoint is reached
 */
export async function POST(
  request: Request,
  { params }: { params: { sessionid: string; accountid: string } },
) {
  try {
    const { media_id, media_type, favorite } = await request.json();
    const result = await fetcher<ITMDBShowResponse>(
      `${process.env.BASETMDBURL}/account/${params.accountid}/favorite`,
      {
        body: JSON.stringify({
          media_id,
          media_type,
          favorite,
        }),
      },
      {
        tmdbContext: {
          api_key: process.env.TMDB_API_KEY!,
          session_id: params.sessionid,
        },
      },
    );
    console.log(`${process.env.BASETMDBURL}/account/${params.accountid}/favorite`, media_id);
    [params.accountid, "favorite"].forEach((tag) => revalidateTag(tag));
    return Response.json({ revalidate: true, result });
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

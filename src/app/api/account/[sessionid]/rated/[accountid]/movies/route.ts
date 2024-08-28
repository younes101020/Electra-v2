import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";

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
    const moviesRating = await fetcher<ITMDBShowResponse>(
      `${process.env.BASETMDBURL}/account/${params.accountid}/rated/movies`,
      {
        method: "GET",
        next: { tags: [`rated:${params.accountid}`] },
      },
      {
        tmdbContext: {
          session_id: params.sessionid,
        },
      },
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

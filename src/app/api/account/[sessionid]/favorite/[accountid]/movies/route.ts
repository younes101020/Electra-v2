import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { revalidateTag } from "next/cache";

/**
 * This endpoint returns a list of favorite movies for a specific tmdb account
 *
 * Note: The favorite movies is cached and will be invalidate for each user favorite movies mutation
 */
export async function GET(
  request: Request,
  { params }: { params: { sessionid: string; accountid: string } },
) {
  try {
    const favShows = await fetcher<ITMDBShowResponse>(
      `${process.env.BASETMDBURL}/account/${params.accountid}/favorite/movies`,
      {
        method: "GET",
        next: { tags: [`favorite:${params.accountid}`] },
      },
      {
        tmdbContext: {
          session_id: params.sessionid,
        },
      },
    );
    const favShowsMinimalData = favShows.results.map((show) => ({
      id: show.id,
      poster_path: show.poster_path,
      original_title: show.original_title,
    }));
    return Response.json({ results: favShowsMinimalData });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error }, { status: 502 });
  }
}

/**
 * This endpoint remove/add movies to favorite
 * Three thing are required inside the body: `media_id`, `media_type` and a boolean which indicates whether or not we should include the content to the favorite
 *
 * Note: user favorite cache is reset each time this endpoint with post method is invoked
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
          session_id: params.sessionid,
        },
      },
    );
    revalidateTag(`favorite:${params.accountid}`);
    return Response.json({ revalidate: true, result });
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

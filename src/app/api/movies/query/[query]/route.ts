import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";

/**
 * This endpoint return a list of movies depending on a query
 * Only one information is requested and this is the query
 *
 * Note: The movies cache has a lifespan of 1 hour
 */
export async function GET(
  request: Request,
  { params: { query } }: { params: { query: string } },
) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const shows = await fetcher<ITMDBShowResponse>(
      `${process.env.BASETMDBURL}/search/movie?query=${encodedQuery}`,
      { method: "GET", next: { revalidate: 3600 } },
      {
        tmdbContext: {},
      },
    );
    const filteredShows = shows.results.map(
      ({ id, vote_average, title, poster_path }) => ({
        id,
        vote_average,
        title,
        poster_path,
      }),
    );
    return Response.json({ ...shows, results: filteredShows });
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}
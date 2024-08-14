import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { unstable_cache } from "next/cache";

/**
 * This endpoint return a list of movies depending on a query
 * Only one information is requested and this is the query
 *
 * Note: The movies cache has a lifespan of 30 seconds
 */
export async function GET(
  request: Request,
  { params }: { params: { query: string } },
) {
  try {
    const movies = await getCachedMovies(params.query);
    return Response.json(movies);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

const getCachedMovies = async (query: string) => {
  const cachedMovies = unstable_cache(
    async (query) => getMovies(query),
    [query],
    {
      revalidate: 30,
    },
  );
  const movies = await cachedMovies(query);
  return movies;
};

const getMovies = async (query: string) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const shows = await fetcher<ITMDBShowResponse>(
      `${process.env.BASETMDBURL}/search/movie?query=${encodedQuery}`,
      { method: "GET" },
      {
        tmdbContext: {
          api_key: process.env.TMDB_API_KEY!,
        },
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
    return { ...shows, results: filteredShows };
  } catch (error) {
    throw error;
  }
};

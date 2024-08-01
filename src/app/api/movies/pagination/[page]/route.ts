import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { unstable_cache } from "next/cache";

/**
 * This endpoint return a list of movies including title, poster, average grades and id movie
 * Only one information is requested and this is the number of the page to retrieve.
 * Each page contains 20 movies
 *
 * Note: The movies cache has a lifespan of 30 seconds
 */
export async function GET(
  request: Request,
  { params }: { params: { page: string } },
) {
  try {
    const movies = await getCachedMovies(params.page);
    return Response.json(movies);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

const getCachedMovies = async (page: string) => {
  const cachedMovies = unstable_cache(async (page) => getMovies(page), [page], {
    revalidate: 30,
  });
  const movies = await cachedMovies(page);
  return movies;
};

const getMovies = async (page: string) => {
  try {
    const shows = await fetcher<ITMDBShowResponse>(
      `${process.env.BASETMDBURL}/discover/movie?language=fr-FR&page=${page}&sort_by=vote_average.desc`,
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

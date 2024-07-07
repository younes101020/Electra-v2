import { ITMDBShowResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";

export const revalidate = 30;

// Only the 50 first movies pages will benefite of the nextjs caching feature
export function generateStaticParams() {
  const pages = Array.from({ length: 50 }, (v, i) => i + 1);
  return pages;
}

export async function GET({ params }: { params: { page: string } }) {
  try {
    const shows = await fetcher<ITMDBShowResponse>(
      `${process.env.NEXT_PUBLIC_BASETMDBURL}/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=${params.page}&sort_by=vote_average.desc`,
      { method: "GET" },
      {
        tmdbContext: {
          api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
        },
      },
    );
    // Return only the used data to decrease bandwidth
    const filteredShows = shows.results.map(
      ({ id, vote_average, title, poster_path }) => {
        id;
        vote_average;
        title;
        poster_path;
      },
    );
    return Response.json({ ...shows, results: filteredShows });
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

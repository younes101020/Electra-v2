import fetcher from "@/utils/http";

// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const showQueryKeys = {
  all: ["shows"] as const,
  detail: (id: number) => [...showQueryKeys.all, id] as const,
  pagination: (options: { pageIndex: number; pageSize: number }) =>
    [...showQueryKeys.all, options] as const,
  infinite: () => [...showQueryKeys.all, "infinite"] as const,
};

export const getShowsFn = async ({ page }: { page: number }) => {
  const shows = await fetcher(
    `${process.env.NEXT_PUBLIC_BASETMDBURL}/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=${page}&sort_by=vote_average.desc`,
    { method: "GET" },
    {
      tmdbContext: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
      },
    },
  );
  return shows;
};

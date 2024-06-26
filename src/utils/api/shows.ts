import fetcher from "@/utils/http";

export interface IShowResponse {
  pages: {
    results: {
      id: number;
      title: string;
      vote_average: string;
      poster_path: string;
    }[];
    total_pages: number;
    total_results: number;
  }[];
}

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
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=${page}&sort_by=vote_average.desc`,
    { method: "GET" },
  );
  return shows;
};

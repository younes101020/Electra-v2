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

export const getShowsFn = async () => {
  const shows = await fetcher(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
    { method: "GET" },
  );
  return shows;
};

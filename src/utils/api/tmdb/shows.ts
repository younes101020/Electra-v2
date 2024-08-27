import fetcher from "@/utils/http";
import { ITMDBShowDetailsResponse, ITMDBShowResponse } from ".";

// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const showQueryKeys = {
  all: ["shows"] as const,
  query: (query: string) => [...showQueryKeys.all, query] as const,
  detail: (movieId: string | null) => [...showQueryKeys.all, movieId] as const,
  pagination: (options: { pageIndex: number; pageSize: number }) =>
    [...showQueryKeys.all, options] as const,
  infinite: () => [...showQueryKeys.all, "infinite"] as const,
};

type GetRQShowsFnProps = {
  type: "pagination" | "query";
  value: string | number;
};

export const getRQShowsFn = async ({ type, value }: GetRQShowsFnProps) => {
  const shows = await fetcher<ITMDBShowResponse>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/movies/${type}/${type === "pagination" ? value.toString() : value}`,
    { method: "GET" },
  );
  return shows;
};
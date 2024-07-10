import fetcher from "@/utils/http";
import { ITMDBShowResponse } from ".";

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

export const getRQShowsFn = async ({ page }: { page: number }) => {
  const shows = await fetcher<ITMDBShowResponse>(
    `${process.env.NEXT_PUBLIC_BASEURL}/movies/${page}`,
    { method: "GET" },
  );
  return shows;
};

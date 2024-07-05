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
  all: ["favorite"] as const,
  detail: (id: number) => [...showQueryKeys.all, id] as const,
  pagination: (options: { pageIndex: number; pageSize: number }) =>
    [...showQueryKeys.all, options] as const,
  infinite: () => [...showQueryKeys.all, "infinite"] as const,
};

export const bookmarkShowsFn = async ({
  accountId,
  showId,
}: {
  accountId: string;
  showId: string;
}) => {
  const shows = await fetcher(
    `${process.env.NEXT_PUBLIC_BASETMDBURL}/account/${accountId}/favorite`,
    {
      body: JSON.stringify({
        media_id: showId,
        media_type: "movie",
        favorite: true,
      }),
    },
    {
      tmdbContext: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
      },
    },
  );
};

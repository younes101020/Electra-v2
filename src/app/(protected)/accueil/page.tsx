import { cookies } from "next/headers";
import { Card } from "./_components/card";
import fetcher from "@/utils/http";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getShowsFn, showQueryKeys } from "@/utils/api/shows";

export default async function Accueil() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: showQueryKeys.pagination({ pageIndex: 1, pageSize: 20 }),
    queryFn: ({ pageParam }) => getShowsFn({ page: pageParam }),
    initialPageParam: 1,
  });
  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Card />
      </HydrationBoundary>
    </section>
  );
}

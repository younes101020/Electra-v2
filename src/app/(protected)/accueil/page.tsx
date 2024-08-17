import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getRQShowsFn, showQueryKeys } from "@/utils/api/tmdb/shows";
import { cookies } from "next/headers";
import {
  favoriteShowQueryKeys,
  getBookmarkShowsFn,
} from "@/utils/api/tmdb/favorite";
import { verifyAuth } from "@/lib/misc/auth";
import fetcher from "@/utils/http";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import { Form } from "./_components/form";
import { Metadata } from "next";
import getQueryClient from "@/lib/react-query";
import { getTMDBAccountId } from "@/lib/session";

export const metadata: Metadata = {
  title: "Films",
  description: "Consultez des centaines de films directement depuis cette page",
};

export default async function Accueil() {
  // Prefetch movie list + user favorite list from server side
  const queryClient = getQueryClient();
  const tmdbAccoundId = await getTMDBAccountId();
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: showQueryKeys.pagination({ pageIndex: 1, pageSize: 20 }),
      queryFn: ({ pageParam }) =>
        getRQShowsFn({ value: pageParam, type: "pagination" }),
      initialPageParam: 1,
    }),
    queryClient.prefetchQuery({
      queryKey: favoriteShowQueryKeys.all,
      queryFn: () => getBookmarkShowsFn({ accountId: tmdbAccoundId }),
    }),
  ]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-5 py-16 md:p-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Form />
      </HydrationBoundary>
    </div>
  );
}

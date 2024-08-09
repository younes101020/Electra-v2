import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
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

export default async function Accueil() {
  // Prefetch movie list + user favorite list from server side
  const queryClient = new QueryClient();
  const jwt = cookies().get("user_token")?.value!;
  const payload = await verifyAuth({ cookieValue: jwt });
  const accountDetails = await fetcher<ITMDBAccoundDetails>(
    `${process.env.BASETMDBURL}/account`,
    { method: "GET" },
    {
      tmdbContext: {
        api_key: process.env.TMDB_API_KEY!,
        session_id: payload.session_id,
      },
    },
  );
  const tmdbAccoundId = accountDetails.id.toString();
  console.log(tmdbAccoundId, "tmdb account id")
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
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Form />
      </HydrationBoundary>
    </div>
  );
}

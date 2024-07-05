import { Shows } from "./_components/section";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getShowsFn, showQueryKeys } from "@/utils/api/shows";
import { cookies } from "next/headers";
import {
  favoriteShowQueryKeys,
  getBookmarkShowsFn,
} from "@/utils/api/favorite";

export default async function Accueil() {
  const queryClient = new QueryClient();
  const account_id = cookies().get("account_id")?.value!;
  console.log(account_id)
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: showQueryKeys.pagination({ pageIndex: 1, pageSize: 20 }),
      queryFn: ({ pageParam }) => getShowsFn({ page: pageParam }),
      initialPageParam: 1,
    }),
    queryClient.prefetchQuery({
      queryKey: favoriteShowQueryKeys.all,
      queryFn: () => getBookmarkShowsFn({ accountId: account_id }),
    }),
  ]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Shows account_id={account_id!} />
      </HydrationBoundary>
    </div>
  );
}

import { Shows } from "./_components/section";
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
import { redirect } from "next/navigation";

export default async function Accueil() {
  const queryClient = new QueryClient();
  const account_details_str = cookies().get("account_details")?.value!;
  if (!account_details_str) redirect("/");
  const account_details = JSON.parse(account_details_str);
  console.log(account_details)
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: showQueryKeys.pagination({ pageIndex: 1, pageSize: 20 }),
      queryFn: ({ pageParam }) => getRQShowsFn({ page: pageParam }),
      initialPageParam: 1,
    }),
    queryClient.prefetchQuery({
      queryKey: favoriteShowQueryKeys.all,
      queryFn: () => getBookmarkShowsFn({ accountId: account_details.id }),
    }),
  ]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Shows account_id={account_details.id!} />
      </HydrationBoundary>
    </div>
  );
}

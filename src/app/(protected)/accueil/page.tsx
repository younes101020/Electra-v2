import { Shows } from "./_components/section";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getShowsFn, showQueryKeys } from "@/utils/api/shows";
import { cookies } from "next/headers";

export default async function Accueil() {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  console.log(cookies().get("account_id"), "ookkay");
  await queryClient.prefetchInfiniteQuery({
    queryKey: showQueryKeys.pagination({ pageIndex: 1, pageSize: 20 }),
    queryFn: ({ pageParam }) => getShowsFn({ page: pageParam }),
    initialPageParam: 1,
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Shows />
      </HydrationBoundary>
    </div>
  );
}

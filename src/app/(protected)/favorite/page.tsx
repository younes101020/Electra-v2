import getQueryClient from "@/lib/react-query";
import { getTMDBAccountId } from "@/lib/session";
import {
  favoriteShowQueryKeys,
  getBookmarkShowsFn,
} from "@/utils/api/tmdb/favorite";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next/types";
import { FavoriteCards } from "./_components/favoritecard";
import { revalidateTag } from "next/cache";

export const metadata: Metadata = {
  title: "Favoris",
  description:
    "Retrouvez et gérez vos films favoris directement depuis cette page",
};

export default async function FavoritePage() {
  const queryClient = getQueryClient();
  const tmdbAccoundId = await getTMDBAccountId();
  revalidateTag(`favorite:${tmdbAccoundId}`)
  await queryClient.prefetchQuery({
    queryKey: favoriteShowQueryKeys.all,
    queryFn: () => getBookmarkShowsFn({ accountId: tmdbAccoundId }),
  });
  return (
    <section className="grid grid-cols-1 gap-2 px-5 py-16 md:grid-cols-3 md:px-10 lg:grid-cols-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FavoriteCards />
      </HydrationBoundary>
    </section>
  );
}

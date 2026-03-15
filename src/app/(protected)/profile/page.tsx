import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  favoriteShowQueryKeys,
  getBookmarkShowsFn,
} from "@/utils/api/tmdb/favorite";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import getQueryClient from "@/lib/react-query";
import { getTMDBAccountId } from "@/lib/session";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/misc/auth";
import { Metadata } from "next";
import { ProfileContent } from "./_components/profile-content";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Consultez votre profil et vos films favoris",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const queryClient = getQueryClient();
  const tmdbAccountId = await getTMDBAccountId();

  const jwt = cookies().get("user_token")?.value!;
  const payload = await verifyAuth({ cookieValue: jwt });

  const [accountDetails] = await Promise.all([
    fetcher<ITMDBAccoundDetails>(
      `${process.env.BASETMDBURL}/account`,
      { method: "GET" },
      {
        tmdbContext: {
          session_id: payload.session_id,
        },
      },
    ),
    queryClient.prefetchQuery({
      queryKey: favoriteShowQueryKeys.all,
      queryFn: () => getBookmarkShowsFn({ accountId: tmdbAccountId }),
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col gap-8 px-5 py-28 md:px-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfileContent accountDetails={accountDetails} />
      </HydrationBoundary>
    </div>
  );
}

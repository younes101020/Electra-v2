import { getCurrentUserId } from "@/lib/auth-utils";
import { getFriends, getFriendRequests } from "@/services/friendship";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/react-query";
import { friendQueryKeys } from "@/utils/api/social/friends";
import { Metadata } from "next";
import { FriendsContent } from "./_components/friends-content";

export const metadata: Metadata = {
  title: "Mes amis",
  description: "Gérez vos amis et demandes d'amitié",
};

export const dynamic = "force-dynamic";

export default async function FriendsPage() {
  const queryClient = getQueryClient();
  const userId = await getCurrentUserId();

  // Prefetch friends and friend requests in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: friendQueryKeys.list(),
      queryFn: () => getFriends(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: friendQueryKeys.requests(),
      queryFn: () => getFriendRequests(userId),
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col gap-8 px-5 py-28 md:px-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FriendsContent />
      </HydrationBoundary>
    </div>
  );
}

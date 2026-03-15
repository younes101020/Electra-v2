import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/react-query";
import { getCurrentUserId } from "@/lib/auth-utils";
import { getUserProfile } from "@/services/user";
import { getFriendshipStatus } from "@/services/friendship";
import { userQueryKeys } from "@/utils/api/social/users";
import { friendQueryKeys } from "@/utils/api/social/friends";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserProfile } from "./_components/user-profile";

type URLProps = { params: { id: string } };

export async function generateMetadata({
  params,
}: URLProps): Promise<Metadata> {
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) return { title: "Utilisateur introuvable" };

  const profile = await getUserProfile(userId);
  if (!profile) return { title: "Utilisateur introuvable" };

  return {
    title: `Profil de ${profile.name}`,
    description: `Consultez le profil de ${profile.name} sur Electra`,
  };
}

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }: URLProps) {
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) notFound();

  const currentUserId = await getCurrentUserId();

  // If viewing own profile, redirect to /profile
  if (userId === currentUserId) {
    const { redirect } = await import("next/navigation");
    redirect("/profile");
  }

  const queryClient = getQueryClient();

  const profile = await getUserProfile(userId);
  if (!profile) notFound();

  // Prefetch profile and friendship status in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: userQueryKeys.profile(userId),
      queryFn: () => Promise.resolve(profile),
    }),
    queryClient.prefetchQuery({
      queryKey: friendQueryKeys.status(userId),
      queryFn: () => getFriendshipStatus(currentUserId, userId),
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col gap-8 px-5 py-28 md:px-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserProfile userId={userId} currentUserId={currentUserId} />
      </HydrationBoundary>
    </div>
  );
}

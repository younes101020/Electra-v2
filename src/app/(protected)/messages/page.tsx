import { getCurrentUserId } from "@/lib/auth-utils";
import { getUserConversations } from "@/services/conversation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/react-query";
import { conversationQueryKeys } from "@/utils/api/social/conversations";
import { Metadata } from "next";
import { MessagesContent } from "./_components/messages-content";

export const metadata: Metadata = {
  title: "Messages",
  description: "Vos conversations privées",
};

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const queryClient = getQueryClient();
  const userId = await getCurrentUserId();

  await queryClient.prefetchQuery({
    queryKey: conversationQueryKeys.list(),
    queryFn: () => getUserConversations(userId),
  });

  return (
    <div className="flex min-h-screen flex-col px-5 py-28 md:px-24">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MessagesContent />
      </HydrationBoundary>
    </div>
  );
}

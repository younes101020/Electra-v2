import fetcher from "@/utils/http";
import type { ConversationType, DirectMessageType } from "@/index";

// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories

export const conversationQueryKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationQueryKeys.all, "list"] as const,
  detail: (conversationId: number) =>
    [...conversationQueryKeys.all, conversationId] as const,
  messages: (conversationId: number) =>
    [...conversationQueryKeys.all, conversationId, "messages"] as const,
};

/**
 * Fetches all conversations for the current user.
 *
 * @returns Array of conversation records with participants and last message
 */
export const getConversationsFn = async () => {
  const conversations = await fetcher<ConversationType[]>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/conversations`,
    { method: "GET" },
  );
  return conversations;
};

/**
 * Gets or creates a conversation with another user.
 *
 * @param otherUserId - The other user's ID
 * @returns The conversation record
 */
export const getOrCreateConversationFn = async ({
  otherUserId,
}: {
  otherUserId: number;
}) => {
  const conversation = await fetcher<ConversationType>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/conversations`,
    {
      method: "POST",
      body: JSON.stringify({ otherUserId }),
    },
  );
  return conversation;
};

/**
 * Fetches all messages in a conversation.
 *
 * @param conversationId - The conversation ID
 * @returns Array of direct message records
 */
export const getConversationMessagesFn = async ({
  conversationId,
}: {
  conversationId: number;
}) => {
  const messages = await fetcher<DirectMessageType[]>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/conversations/${conversationId}/messages`,
    { method: "GET" },
  );
  return messages;
};

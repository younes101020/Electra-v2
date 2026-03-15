import { db } from "@/lib/db";

/**
 * Gets or creates a 1-on-1 conversation between two users.
 * If a conversation already exists between them, it is returned.
 *
 * @param userId - The current user's ID
 * @param otherUserId - The other user's ID
 * @returns The Conversation record with users and last message
 */
export const getOrCreateConversation = async (
  userId: number,
  otherUserId: number,
) => {
  // Find existing conversation between these two users
  const existing = await db.conversation.findFirst({
    where: {
      AND: [
        { users: { some: { userId } } },
        { users: { some: { userId: otherUserId } } },
      ],
    },
    include: {
      users: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (existing) return existing;

  // Create a new conversation with both users
  return await db.conversation.create({
    data: {
      users: {
        create: [{ userId }, { userId: otherUserId }],
      },
    },
    include: {
      users: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });
};

/**
 * Returns all conversations for a user, ordered by most recent message.
 *
 * @param userId - The current user's ID
 * @returns Array of conversations with participants and last message
 */
export const getUserConversations = async (userId: number) => {
  return await db.conversation.findMany({
    where: {
      users: { some: { userId } },
    },
    include: {
      users: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

/**
 * Returns all messages in a conversation, ordered chronologically.
 * Verifies the user is a participant before returning messages.
 *
 * @param conversationId - The conversation ID
 * @param userId - The current user's ID (for authorization check)
 * @returns Array of DirectMessage records with user info
 */
export const getConversationMessages = async (
  conversationId: number,
  userId: number,
) => {
  // Verify user is a participant
  const participant = await db.conversationUser.findUnique({
    where: {
      userId_conversationId: { userId, conversationId },
    },
  });

  if (!participant) {
    throw new Error("Vous n'êtes pas membre de cette conversation.");
  }

  return await db.directMessage.findMany({
    where: { conversationId },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });
};

/**
 * Creates a new direct message in a conversation.
 * Verifies the user is a participant and updates the conversation's updatedAt.
 *
 * @param conversationId - The conversation ID
 * @param userId - The sender's ID
 * @param content - The message content
 * @returns The created DirectMessage with user info
 */
export const createDirectMessage = async (
  conversationId: number,
  userId: number,
  content: string,
) => {
  // Verify user is a participant
  const participant = await db.conversationUser.findUnique({
    where: {
      userId_conversationId: { userId, conversationId },
    },
  });

  if (!participant) {
    throw new Error("Vous n'êtes pas membre de cette conversation.");
  }

  // Create message and update conversation timestamp in a transaction
  const [message] = await db.$transaction([
    db.directMessage.create({
      data: { content, userId, conversationId },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    }),
    db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  return message;
};

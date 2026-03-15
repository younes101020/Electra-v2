import { db } from "@/lib/db";
import { FriendshipStatus } from "@prisma/client";

/**
 * Sends a friend request from one user to another.
 * Checks that no existing friendship (in either direction) already exists.
 *
 * @param senderId - The ID of the user sending the request
 * @param receiverId - The ID of the user receiving the request
 * @returns The created Friendship record
 */
export const sendFriendRequest = async (
  senderId: number,
  receiverId: number,
) => {
  if (senderId === receiverId) {
    throw new Error("Vous ne pouvez pas vous ajouter vous-même en ami.");
  }

  const existing = await db.friendship.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existing) {
    if (existing.status === FriendshipStatus.PENDING) {
      throw new Error("Une demande d'ami est déjà en attente.");
    }
    if (existing.status === FriendshipStatus.ACCEPTED) {
      throw new Error("Vous êtes déjà amis.");
    }
    // If DECLINED, allow re-sending by updating the existing record
    return await db.friendship.update({
      where: { id: existing.id },
      data: {
        senderId,
        receiverId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });
  }

  return await db.friendship.create({
    data: { senderId, receiverId },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });
};

/**
 * Accepts a pending friend request.
 *
 * @param friendshipId - The ID of the friendship to accept
 * @param userId - The ID of the current user (must be the receiver)
 * @returns The updated Friendship record
 */
export const acceptFriendRequest = async (
  friendshipId: number,
  userId: number,
) => {
  const friendship = await db.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    throw new Error("Demande d'ami introuvable.");
  }
  if (friendship.receiverId !== userId) {
    throw new Error(
      "Vous ne pouvez accepter que les demandes qui vous sont adressées.",
    );
  }
  if (friendship.status !== FriendshipStatus.PENDING) {
    throw new Error("Cette demande n'est plus en attente.");
  }

  return await db.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.ACCEPTED },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });
};

/**
 * Declines a pending friend request.
 *
 * @param friendshipId - The ID of the friendship to decline
 * @param userId - The ID of the current user (must be the receiver)
 * @returns The updated Friendship record
 */
export const declineFriendRequest = async (
  friendshipId: number,
  userId: number,
) => {
  const friendship = await db.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    throw new Error("Demande d'ami introuvable.");
  }
  if (friendship.receiverId !== userId) {
    throw new Error(
      "Vous ne pouvez décliner que les demandes qui vous sont adressées.",
    );
  }
  if (friendship.status !== FriendshipStatus.PENDING) {
    throw new Error("Cette demande n'est plus en attente.");
  }

  return await db.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.DECLINED },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });
};

/**
 * Returns all pending friend requests received by a user.
 *
 * @param userId - The ID of the current user
 * @returns Array of pending Friendship records with sender info
 */
export const getFriendRequests = async (userId: number) => {
  return await db.friendship.findMany({
    where: {
      receiverId: userId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Returns all pending friend requests sent by a user.
 *
 * @param userId - The ID of the current user
 * @returns Array of pending Friendship records with receiver info
 */
export const getSentRequests = async (userId: number) => {
  return await db.friendship.findMany({
    where: {
      senderId: userId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      receiver: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Returns all accepted friends for a user.
 *
 * @param userId - The ID of the current user
 * @returns Array of accepted Friendship records with both user infos
 */
export const getFriends = async (userId: number) => {
  return await db.friendship.findMany({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
};

/**
 * Returns the friendship status between two users, if any.
 *
 * @param userId - The current user's ID
 * @param otherUserId - The other user's ID
 * @returns The Friendship record or null
 */
export const getFriendshipStatus = async (
  userId: number,
  otherUserId: number,
) => {
  return await db.friendship.findFirst({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });
};

/**
 * Removes a friendship (unfriend). Either party can remove.
 *
 * @param friendshipId - The ID of the friendship to remove
 * @param userId - The ID of the current user (must be sender or receiver)
 * @returns The deleted Friendship record
 */
export const removeFriend = async (friendshipId: number, userId: number) => {
  const friendship = await db.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    throw new Error("Relation d'amitié introuvable.");
  }
  if (friendship.senderId !== userId && friendship.receiverId !== userId) {
    throw new Error("Vous ne pouvez supprimer que vos propres relations.");
  }

  return await db.friendship.delete({
    where: { id: friendshipId },
  });
};

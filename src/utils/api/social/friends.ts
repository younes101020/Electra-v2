import fetcher from "@/utils/http";
import type { FriendshipType } from "@/index";

// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories

export const friendQueryKeys = {
  all: ["friends"] as const,
  list: () => [...friendQueryKeys.all, "list"] as const,
  requests: () => [...friendQueryKeys.all, "requests"] as const,
  sent: () => [...friendQueryKeys.all, "sent"] as const,
  status: (otherUserId: number) =>
    [...friendQueryKeys.all, "status", otherUserId] as const,
};

/**
 * Fetches the current user's accepted friends.
 *
 * @returns Array of friendship records
 */
export const getFriendsFn = async () => {
  const friends = await fetcher<FriendshipType[]>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/friends`,
    { method: "GET" },
  );
  return friends;
};

/**
 * Fetches pending friend requests received by the current user.
 *
 * @returns Array of pending friendship records
 */
export const getFriendRequestsFn = async () => {
  const requests = await fetcher<FriendshipType[]>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/friends/requests`,
    { method: "GET" },
  );
  return requests;
};

/**
 * Sends a friend request to another user.
 *
 * @param receiverId - The target user's ID
 * @returns The created friendship record
 */
export const sendFriendRequestFn = async ({
  receiverId,
}: {
  receiverId: number;
}) => {
  const result = await fetcher<FriendshipType>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/friends/request`,
    {
      method: "POST",
      body: JSON.stringify({ receiverId }),
    },
  );
  return result;
};

/**
 * Accepts a pending friend request.
 *
 * @param friendshipId - The friendship record ID
 * @returns The updated friendship record
 */
export const acceptFriendRequestFn = async ({
  friendshipId,
}: {
  friendshipId: number;
}) => {
  const result = await fetcher<FriendshipType>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/friends/accept`,
    {
      method: "POST",
      body: JSON.stringify({ friendshipId }),
    },
  );
  return result;
};

/**
 * Declines a pending friend request.
 *
 * @param friendshipId - The friendship record ID
 * @returns The updated friendship record
 */
export const declineFriendRequestFn = async ({
  friendshipId,
}: {
  friendshipId: number;
}) => {
  const result = await fetcher<FriendshipType>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/friends/decline`,
    {
      method: "POST",
      body: JSON.stringify({ friendshipId }),
    },
  );
  return result;
};

/**
 * Removes a friend (unfriend).
 *
 * @param friendshipId - The friendship record ID
 * @returns The deleted friendship record
 */
export const removeFriendFn = async ({
  friendshipId,
}: {
  friendshipId: number;
}) => {
  const result = await fetcher<FriendshipType>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/friends/${friendshipId}`,
    { method: "DELETE" },
  );
  return result;
};

/**
 * Fetches the friendship status between the current user and another user.
 *
 * @param otherUserId - The other user's ID
 * @returns The friendship record or null
 */
export const getFriendshipStatusFn = async ({
  otherUserId,
}: {
  otherUserId: number;
}) => {
  const result = await fetcher<FriendshipType | null>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/friends/status?userId=${otherUserId}`,
    { method: "GET" },
  );
  return result;
};

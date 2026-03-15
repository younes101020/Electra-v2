import { db } from "@/lib/db";

/**
 * Searches for users by name (case-insensitive partial match).
 * Excludes the current user from results.
 *
 * @param query - The search string
 * @param currentUserId - The current user's ID (excluded from results)
 * @returns Array of matching User records
 */
export const searchUsers = async (query: string, currentUserId: number) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  return await db.user.findMany({
    where: {
      name: {
        contains: query.trim(),
        mode: "insensitive",
      },
      NOT: { id: currentUserId },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take: 20,
  });
};

/**
 * Returns a user's public profile information.
 *
 * @param userId - The user's ID
 * @returns The User record or null if not found
 */
export const getUserProfile = async (userId: number) => {
  return await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
};

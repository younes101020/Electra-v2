import fetcher from "@/utils/http";
import type { UserProfile } from "@/index";

// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories

export const userQueryKeys = {
  all: ["users"] as const,
  search: (query: string) => [...userQueryKeys.all, "search", query] as const,
  profile: (userId: number) =>
    [...userQueryKeys.all, "profile", userId] as const,
};

/**
 * Searches users by name.
 *
 * @param query - The search string (min 2 characters)
 * @returns Array of matching user profiles
 */
export const searchUsersFn = async ({ query }: { query: string }) => {
  const users = await fetcher<UserProfile[]>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/users/search?q=${encodeURIComponent(query)}`,
    { method: "GET" },
  );
  return users;
};

/**
 * Fetches a user's public profile by ID.
 *
 * @param userId - The user's ID
 * @returns The user profile
 */
export const getUserProfileFn = async ({ userId }: { userId: number }) => {
  const profile = await fetcher<UserProfile>(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/users/${userId}`,
    { method: "GET" },
  );
  return profile;
};

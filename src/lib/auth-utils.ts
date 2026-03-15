import { cookies } from "next/headers";
import { verifyAuth } from "./misc/auth";
import { db } from "./db";
import fetcher from "@/utils/http";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";

/**
 * Extracts the current user's numeric ID from the JWT cookie.
 * Prefers the `user_id` field embedded in the JWT (fast path).
 * Falls back to fetching from TMDB if the JWT was issued before the user_id enhancement.
 *
 * @returns The numeric TMDB account ID of the current user
 */
export async function getCurrentUserId(): Promise<number> {
  const jwt = cookies().get("user_token")?.value!;
  const payload = await verifyAuth({ cookieValue: jwt });

  if (payload.user_id !== undefined) {
    return payload.user_id;
  }

  // Fallback for JWTs issued before user_id was added to the payload
  const accountDetails = await fetcher<ITMDBAccoundDetails>(
    `${process.env.BASETMDBURL}/account`,
    { method: "GET" },
    { tmdbContext: { session_id: payload.session_id } },
  );
  return accountDetails.id;
}

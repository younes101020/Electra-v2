import { cookies } from "next/headers";
import { verifyAuth } from "./misc/auth";
import fetcher from "@/utils/http";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";

/**
 * This function is used to extract user session details on page level
 */
export async function getTMDBAccountId() {
  const jwt = cookies().get("user_token")?.value!;
  const payload = await verifyAuth({ cookieValue: jwt });
  const accountDetails = await fetcher<ITMDBAccoundDetails>(
    `${process.env.BASETMDBURL}/account`,
    { method: "GET" },
    {
      tmdbContext: {
        session_id: payload.session_id,
      },
    },
  );
  const tmdbAccoundId = accountDetails.id;
  return tmdbAccoundId;
}

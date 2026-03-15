import { getCurrentUserId } from "@/lib/auth-utils";
import { getFriendRequests } from "@/services/friendship";

/**
 * Returns all pending friend requests received by the current user.
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const requests = await getFriendRequests(userId);
    return Response.json(requests);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

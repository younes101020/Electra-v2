import { getCurrentUserId } from "@/lib/auth-utils";
import { getFriends } from "@/services/friendship";

/**
 * Returns all accepted friends for the current user.
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const friends = await getFriends(userId);
    return Response.json(friends);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

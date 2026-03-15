import { getCurrentUserId } from "@/lib/auth-utils";
import { getFriendshipStatus } from "@/services/friendship";

/**
 * Returns the friendship status between the current user and another user.
 * Query: ?userId=<number>
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const otherUserId = parseInt(searchParams.get("userId") || "", 10);
    if (isNaN(otherUserId)) {
      return Response.json(
        { error: "userId est requis et doit être un nombre." },
        { status: 400 },
      );
    }
    const userId = await getCurrentUserId();
    const friendship = await getFriendshipStatus(userId, otherUserId);
    return Response.json(friendship);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

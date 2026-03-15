import { getCurrentUserId } from "@/lib/auth-utils";
import { acceptFriendRequest } from "@/services/friendship";

/**
 * Accepts a pending friend request.
 * Body: { friendshipId: number }
 */
export async function POST(request: Request) {
  try {
    const { friendshipId } = await request.json();
    if (!friendshipId || typeof friendshipId !== "number") {
      return Response.json(
        { error: "friendshipId est requis et doit être un nombre." },
        { status: 400 },
      );
    }
    const userId = await getCurrentUserId();
    const friendship = await acceptFriendRequest(friendshipId, userId);
    return Response.json(friendship);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

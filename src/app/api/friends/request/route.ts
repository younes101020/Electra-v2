import { getCurrentUserId } from "@/lib/auth-utils";
import { sendFriendRequest } from "@/services/friendship";

/**
 * Sends a friend request to another user.
 * Body: { receiverId: number }
 */
export async function POST(request: Request) {
  try {
    const { receiverId } = await request.json();
    if (!receiverId || typeof receiverId !== "number") {
      return Response.json(
        { error: "receiverId est requis et doit être un nombre." },
        { status: 400 },
      );
    }
    const userId = await getCurrentUserId();
    const friendship = await sendFriendRequest(userId, receiverId);
    return Response.json(friendship);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

import { getCurrentUserId } from "@/lib/auth-utils";
import { removeFriend } from "@/services/friendship";

/**
 * Removes a friendship (unfriend).
 * The current user must be the sender or receiver of the friendship.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { friendshipId: string } },
) {
  try {
    const friendshipId = parseInt(params.friendshipId, 10);
    if (isNaN(friendshipId)) {
      return Response.json(
        { error: "friendshipId invalide." },
        { status: 400 },
      );
    }
    const userId = await getCurrentUserId();
    const result = await removeFriend(friendshipId, userId);
    return Response.json(result);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

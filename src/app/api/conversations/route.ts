import { getCurrentUserId } from "@/lib/auth-utils";
import {
  getUserConversations,
  getOrCreateConversation,
} from "@/services/conversation";

/**
 * GET: Returns all conversations for the current user.
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const conversations = await getUserConversations(userId);
    return Response.json(conversations);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

/**
 * POST: Gets or creates a conversation with another user.
 * Body: { otherUserId: number }
 */
export async function POST(request: Request) {
  try {
    const { otherUserId } = await request.json();
    if (!otherUserId || typeof otherUserId !== "number") {
      return Response.json(
        { error: "otherUserId est requis et doit être un nombre." },
        { status: 400 },
      );
    }
    const userId = await getCurrentUserId();
    const conversation = await getOrCreateConversation(userId, otherUserId);
    return Response.json(conversation);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

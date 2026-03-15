import { getCurrentUserId } from "@/lib/auth-utils";
import { getConversationMessages } from "@/services/conversation";

/**
 * Returns all messages in a conversation.
 * The current user must be a participant.
 */
export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } },
) {
  try {
    const conversationId = parseInt(params.conversationId, 10);
    if (isNaN(conversationId)) {
      return Response.json(
        { error: "conversationId invalide." },
        { status: 400 },
      );
    }
    const userId = await getCurrentUserId();
    const messages = await getConversationMessages(conversationId, userId);
    return Response.json(messages);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

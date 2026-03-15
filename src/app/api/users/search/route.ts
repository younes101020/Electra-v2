import { getCurrentUserId } from "@/lib/auth-utils";
import { searchUsers } from "@/services/user";

/**
 * Searches for users by name (case-insensitive partial match).
 * Requires a `q` query parameter with at least 2 characters.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const currentUserId = await getCurrentUserId();
    const users = await searchUsers(query, currentUserId);
    return Response.json(users);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

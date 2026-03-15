import { getUserProfile } from "@/services/user";

/**
 * Returns a user's public profile by ID.
 */
export async function GET(
  _request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return Response.json(
        { error: "userId doit être un nombre valide." },
        { status: 400 },
      );
    }
    const profile = await getUserProfile(userId);
    if (!profile) {
      return Response.json(
        { error: "Utilisateur introuvable." },
        { status: 404 },
      );
    }
    return Response.json(profile);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

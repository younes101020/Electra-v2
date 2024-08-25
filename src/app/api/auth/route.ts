import { db } from "@/lib/db";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";

/**
 * This endpoint check if tmdb user is persisted into our database if not insert it
 */
export async function POST(request: Request) {
  const { session_id } = await request.json();
  const accountDetails = await fetcher<ITMDBAccoundDetails>(
    `${process.env.BASETMDBURL}/account`,
    { method: "GET" },
    {
      tmdbContext: {
        session_id,
      },
    },
  );
  const user = await db.user.findFirst({
    where: {
      id: accountDetails.id,
    },
  });
  if (!user) {
    await db.user.create({
      data: {
        id: accountDetails.id,
        name: accountDetails.username,
        image: accountDetails.avatar.tmdb.avatar_path,
      },
    });
  }
  return Response.json(
    { message: "db user is in sync with tmdb service user" },
    { status: 200 },
  );
}

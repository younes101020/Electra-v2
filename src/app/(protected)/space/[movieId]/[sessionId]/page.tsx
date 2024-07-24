import useSocketConnection from "@/hooks/useSockerConnection";
import { Messages } from "./_components/messages";
import fetcher from "@/utils/http";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import { db } from "@/lib/db";
import { Chat } from "./_components/chat";

export default async function SpacePage({
  params,
}: {
  params: { movieId: string; sessionId: string };
}) {
  /**
   * Retrieve user account detail and check if space already exist, if not create one
   */
  const accountDetails = await fetcher<ITMDBAccoundDetails>(
    `${process.env.BASETMDBURL}/account`,
    { method: "GET" },
    {
      tmdbContext: {
        api_key: process.env.TMDB_API_KEY!,
        session_id: params.sessionId,
      },
    },
  );
  const space = await db.space.findFirst({
    where: {
      showId: params.movieId,
    },
    select: {
      message: {
        select: {
          content: true,
          id: true,
          spaceId: true,
        },
      },
    },
  });
  if (!space) {
    await db.space.create({
      data: {
        showId: params.movieId,
        users: {
          connect: {
            id: accountDetails.id,
          },
        },
      },
    });
  }
  return (
    <Chat
      initiatorUsername={accountDetails.name}
      message={space?.message ?? []}
    />
  );
}

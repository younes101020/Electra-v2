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
   * Retrieve user account detail and check if space already exist, if not create new one and bind the user into it
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
  let spaceId;
  
  const space = await db.space.findFirst({
    where: {
      showId: params.movieId,
    },
    select: {
      id: true,
      message: {
        select: {
          content: true,
          id: true,
          spaceId: true,
          user: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      },
    },
  });
  const spaceUsers = space && space.message.map((msg) => msg.user);
  if(!space) {
    spaceId = await db.space.create({
        data: {
          showId: params.movieId,
          users: {
            connect: {
              id: accountDetails.id,
            },
          },
        },
        select: {
          id: true,
        },
      })
  }
  return (
    <Chat
      initiatorUsername={accountDetails.name}
      message={space?.message ?? []}
      user={spaceUsers ?? []}
      space={spaceId ? spaceId.id : space?.id!}
    />
  );
}

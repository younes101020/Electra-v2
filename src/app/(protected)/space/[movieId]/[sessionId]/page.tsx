import fetcher from "@/utils/http";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import { db } from "@/lib/db";
import { Chat } from "./_components/chat";
import {
  getSpaceEntities,
  setSpaceEntities,
  setUserToSpace,
} from "@/services/space";

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
  let newSpace;
  const space = await getSpaceEntities({ movieId: params.movieId });
  console.log(space);
  if (!space) {
    newSpace = await setSpaceEntities({
      movieId: params.movieId,
      userId: accountDetails.id,
    });
    return <Chat space={newSpace.id} />;
  }
  // If user is not in the space, add it
  if (!space.users.some((user) => user.id === accountDetails.id)) {
    await setUserToSpace({ spaceId: space.id, userId: accountDetails.id });
    space.users.push({
      name: accountDetails.username,
      id: accountDetails.id,
      image: accountDetails.avatar.tmdb.avatar_path,
    });
  }
  return <Chat message={space.message} user={space.users} space={space.id} />;
}

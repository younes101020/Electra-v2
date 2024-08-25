import fetcher from "@/utils/http";
import { ITMDBAccoundDetails, ITMDBShowDetailsResponse, ITMDBStatusResponse } from "@/utils/api/tmdb";
import { Chat } from "./_components/chat";
import {
  getSpaceEntities,
  setSpaceEntities,
  setUserToSpace,
} from "@/services/space";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Space",
  description: "Discutez à propos du film avec d'autres cinéphiles",
};

export default async function SpacePage({
  params,
}: {
  params: { movieId: string; sessionId: string };
}) {
  console.log(params.movieId)
  /**
   * If movie didnt exist redirect to /accueil
   */
  const showDetails = await fetcher<ITMDBShowDetailsResponse>(
    `${process.env.BASETMDBURL}/movie/${params.movieId}`,
    { method: "GET" },
    {
      tmdbContext: {},
    },
  );
  console.log(showDetails, "caca")
  if("success" in showDetails && !showDetails.success) {
    redirect("/accueil");
  }
  /**
   * Retrieve user account detail and check if space already exist, if not create new one and bind the user into it
   */
  const accountDetails = await fetcher<ITMDBAccoundDetails>(
    `${process.env.BASETMDBURL}/account`,
    { method: "GET" },
    {
      tmdbContext: {
        session_id: params.sessionId,
      },
    },
  );
  let newSpace;
  const space = await getSpaceEntities({ movieId: params.movieId });
  if (!space) {
    newSpace = await setSpaceEntities({
      movieId: params.movieId,
      userId: accountDetails.id,
    });
    return <Chat space={newSpace.id} user={newSpace.users} />;
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

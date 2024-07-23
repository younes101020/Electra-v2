import useSocketConnection from "@/hooks/useSockerConnection";
import { socket } from "@/lib/socket";
import { Messages } from "./_components/messages";
import fetcher from "@/utils/http";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import { db } from "@/lib/db";

export default async function SpacePage({
  params,
}: {
  params: { movieId: string; sessionId: string };
}) {
  /**
   * Check if space already exist, if not create one
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
  });
  if (!space) {
    await db.space.create({
      data: {
        userId: accountDetails.id,
        showId: params.movieId,
      },
    });
  }
  const { isConnected, transport, users, messages, sendMessage } =
    useSocketConnection(socket, "younes");
  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <div className="flex w-full justify-center">
        <Messages messages={messages} users={users} />
      </div>
    </div>
  );
}

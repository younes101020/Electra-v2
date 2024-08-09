import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { NextRequest } from "next/server";

/**
 * In this endpoint the ``accountid`` dynamic segment represent tmdb ``session_id``
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionid: string } },
) {
  const accountDetails = await fetcher<ITMDBAccoundDetails>(
    `${process.env.BASETMDBURL}/account`,
    { method: "GET" },
    {
      tmdbContext: {
        api_key: process.env.TMDB_API_KEY!,
        session_id: params.sessionid,
      },
    },
  );
  return Response.json(accountDetails, { status: 200 });
}

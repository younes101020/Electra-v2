/**
 * This endpoint remove/add rate to movie
 * POST need `value` body which represent a rating of 10 and `movieid` search params which represent the movie
 * DELETE only need `movieid` search params
 *
 * Note: account movies rating cache is reset each time this endpoint with post method is invoked
 */

import { ITMDBStatusResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { revalidateTag } from "next/cache";

export async function POST(
  request: Request,
  {
    params,
  }: { params: { sessionid: string; accountid: string; movieid: string } },
) {
  try {
    const { value } = await request.json();
    const result = await fetcher<ITMDBStatusResponse>(
      `${process.env.BASETMDBURL}/movie/${params.movieid}/rating`,
      {
        body: JSON.stringify({
          value,
        }),
      },
      {
        tmdbContext: {
          session_id: params.sessionid,
        },
      },
    );
    // see: https://github.com/vercel/next.js/issues/69064
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(revalidateTag(`rated:${params.accountid}`));
      }, 3000);
    });
    return Response.json({ revalidate: true, result });
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error }, { status: 502 });
  }
}

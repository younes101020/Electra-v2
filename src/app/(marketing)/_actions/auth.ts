"use server";

import fetcher from "@/utils/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function auth() {
  const data = await fetcher(
    process.env.NEXT_PUBLIC_BASETMDBURL + "/authentication/token/new",
    {
      method: "GET",
    },
    {
      tmdbContext: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
      },
    },
  );
  cookies().set("request_token", data.request_token);
  redirect(
    `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${process.env.NEXT_PUBLIC_BASEURL}/approved`,
  );
}

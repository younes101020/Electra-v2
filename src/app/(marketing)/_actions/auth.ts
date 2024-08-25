"use server";

import { ITMDBNewAuthTokenResp } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function auth() {
  const data = await fetcher<ITMDBNewAuthTokenResp>(
    process.env.BASETMDBURL + "/authentication/token/new",
    {
      method: "GET",
    },
    {
      tmdbContext: {},
    },
  );
  cookies().set("request_token", data.request_token);
  redirect(
    `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${process.env.NEXT_PUBLIC_BASEURL}/approved`,
  );
}

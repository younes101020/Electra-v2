"use server";

import fetcher from "@/utils/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function auth() {
  const data = await fetcher(
    "https://api.themoviedb.org/4/auth/request_token",
    {
      body: JSON.stringify({
        redirect_to: `${process.env.NEXT_PUBLIC_BASEURL}/approved`,
      }),
    },
  );
  cookies().set("request_token", data.request_token);
  redirect(
    `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`,
  );
}

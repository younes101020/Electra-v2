"use server";

import fetcher from "@/utils/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function auth() {
  const response = await fetcher(
    "https://api.themoviedb.org/4/auth/request_token",
    {
      body: JSON.stringify({
        redirect_to: `${process.env.NEXT_PUBLIC_BASEURL}/approved`,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Une erreur s'est produite lors de la tentative d'authentification, veuillez réessayer"
    );
  }
  const data = await response.json();
  cookies().set("request_token", data.request_token);
  redirect(
    `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`
  );
}

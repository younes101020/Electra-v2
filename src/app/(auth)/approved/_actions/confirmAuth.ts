"use server";

import { authSchema } from "@/lib/zod/auth";
import fetcher from "@/utils/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function confirmAuth(payload: {
  access_token: string;
  account_id: string;
}) {
  const validatedPayload = authSchema.safeParse(payload);
  if (!validatedPayload.success) {
    return {
      error: validatedPayload.error.flatten().fieldErrors,
    };
  }
  const response = await fetcher(
    `https://api.themoviedb.org/4/account/${validatedPayload.data.account_id}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error(
      "Une erreur s'est produite lors de la tentative d'authentification, veuillez réessayer"
    );
  }
  const accountDetails = await response.json();
  cookies().set("access_token", validatedPayload.data.access_token);
  cookies().set("account_id", validatedPayload.data.account_id);
  cookies().set("username", accountDetails.username);
  redirect("/accueil");
}

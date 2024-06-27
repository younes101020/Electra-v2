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
  console.log("data:", validatedPayload)
  const accountDetails = await fetcher(
    `https://api.themoviedb.org/4/account/${validatedPayload.data.account_id}`,
    {
      method: "GET",
    }
  );
  cookies().set("access_token", validatedPayload.data.access_token);
  cookies().set("account_id", validatedPayload.data.account_id);
  cookies().set("username", accountDetails.username);
  redirect("/accueil");
}

"use server";

import { authSchema } from "@/lib/zod/auth";
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
  cookies().set("access_token", validatedPayload.data.access_token);
  cookies().set("account_id", validatedPayload.data.account_id);
  redirect("/accueil");
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  cookies().delete("request_token");
  cookies().delete("access_token");
  cookies().delete("account_id");
  redirect('/')
}

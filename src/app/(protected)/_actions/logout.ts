"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const allCookies = cookies().getAll();
  allCookies.forEach((cookie) => {
    cookies().delete(cookie.name);
  });
  redirect("/");
}

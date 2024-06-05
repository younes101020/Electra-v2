import { cookies } from "next/headers";

export const auth = () => {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.get("access_token");
  const usernameCookie = cookieStore.get("username");
  if (!isLoggedIn || !usernameCookie) return false;
  return usernameCookie?.value;
};

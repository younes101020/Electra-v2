import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AccueilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.get("access_token");
  console.log(isLoggedIn)
  if (!isLoggedIn) redirect("/");
  return <section>{children}</section>;
}

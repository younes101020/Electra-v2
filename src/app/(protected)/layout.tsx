import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "./_components/header";

interface IAccountDetails {
  user: { name: string; username: string };
}

export default function AccueilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.get("access_token");
  if (!isLoggedIn) redirect("/");
  const usernameCookie = cookieStore.get("username");
  const username = usernameCookie?.value;
  return (
    <>
      <Header username={username!} />
      <main>{children}</main>
    </>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "./_components/header";

export default function AccueilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.get("access_token");
  console.log(isLoggedIn);
  if (!isLoggedIn) redirect("/");
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

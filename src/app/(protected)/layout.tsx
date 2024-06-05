import { redirect } from "next/navigation";
import { Header } from "./_components/header";
import { auth } from "@/utils/auth";
import RQCProviders from "@/providers/reactquery";

export default function AccueilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = auth();
  if (!username) redirect("/");
  return (
    <>
      <Header username={username!} />
      <main>
        <RQCProviders>{children}</RQCProviders>
      </main>
    </>
  );
}

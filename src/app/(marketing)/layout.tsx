import { auth } from "@/utils/auth";
import { Header } from "./_components/header";
import { redirect } from "next/navigation";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const username = auth();
  if (username) redirect("/accueil");
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

import RQCProviders from "@/providers/reactquery";
import { SessionStoreProvider } from "@/providers/session";
import { Metadata } from "next/types";
import { Header } from "./_components/header";
import Breadcrumbs from "./_components/breadcrumbs";

export const metadata: Metadata = {
  title: "Electra",
  description:
    "Interagissez avec des cinéphiles qui partage les mêmes gouts que vous",
};

export default function AccueilLayout({
  children,
}: {
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
}) {
  return (
    <SessionStoreProvider>
      <Header><Breadcrumbs /></Header>
      <main>
        <RQCProviders>{children}</RQCProviders>
      </main>
    </SessionStoreProvider>
  );
}

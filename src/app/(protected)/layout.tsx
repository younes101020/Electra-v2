import RQCProviders from "@/providers/reactquery";
import { CounterStoreProvider } from "@/providers/session";
import { Metadata } from "next/types";
import { Header } from "./_components/header";

export const metadata: Metadata = {
  title: "Electra",
  description:
    "Interagissez avec des cinéphiles qui partage les mêmes gouts que vous",
};

export default function AccueilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CounterStoreProvider>
      <Header />
      <main>
        <RQCProviders>{children}</RQCProviders>
      </main>
    </CounterStoreProvider>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Sora } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const sora = Sora({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Electra",
  description: "Rejoignez l'une de nos nombreuse communautée",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          sora.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

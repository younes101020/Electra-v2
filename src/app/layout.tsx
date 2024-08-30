import type { Metadata } from "next";
import "./globals.css";
import { Sora } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SiteFooter } from "@/components/footer";
import { siteConfig } from "@/config/site";

const sora = Sora({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: ["Cinéma", "Films", "Rencontre", "Cinéphile", "Bestseller"],
  authors: [
    {
      name: "younes101020",
      url: "http://younesfakallah.fr",
    },
  ],
  creator: "younes101020",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@untilsw",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
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
          sora.variable,
        )}
      >
        {children}
        <Toaster />
        <SiteFooter />
      </body>
    </html>
  );
}

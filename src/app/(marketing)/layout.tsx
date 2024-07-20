import { Header } from "./_components/header";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

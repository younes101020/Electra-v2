import Link from "next/link";
import { UserAccountNav } from "@/components/user-account-nav";

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="flex flex-col gap-2 fixed z-50 w-full px-5 md:px-24 py-2 bg-black/50">
      <div className="flex justify-between">
        <Link href="/movies">
          <h1 className="text-4xl">Electra</h1>
        </Link>
        <UserAccountNav />
      </div>
      {children}
    </header>
  );
};

export { Header };

import Link from "next/link";
import { UserAccountNav } from "@/components/user-account-nav";

const Header = () => {
  return (
    <header className="flex justify-between px-4 md:px-44 py-2 fixed z-50 w-full bg-black/50">
      <Link href="/accueil">
        <h1 className="text-4xl">Electra</h1>
      </Link>
      <UserAccountNav />
    </header>
  );
};

export { Header };

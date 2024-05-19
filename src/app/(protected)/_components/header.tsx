import Link from "next/link";
import { UserAccountNav } from "./user-account-nav";

const Header = () => {
  return (
    <header className="flex justify-between px-44 py-2">
      <Link href="/accueil">
        <h1 className="text-4xl">Electra</h1>
      </Link>
      <UserAccountNav
        user={{
          name: "test test",
          image: null,
          email: "test@gmail.com",
        }}
      />
    </header>
  );
};

export { Header };

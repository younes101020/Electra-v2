import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserAccountNav } from "@/components/user-account-nav";
import { auth as checkAuth } from "@/utils/auth";
import { auth } from "../_actions/auth";

const Header = async () => {
  const session = checkAuth();
  return (
    <header className="flex justify-between px-44 py-2">
      <Link href="/">
        <h1 className="text-4xl">Electra</h1>
      </Link>
      {session ? (
        <UserAccountNav
          user={{
            name: session,
            image: null,
          }}
        />
      ) : (
        <form action={auth}>
          <Button type="submit">S'authentifier</Button>
        </form>
      )}
    </header>
  );
};

export { Header };

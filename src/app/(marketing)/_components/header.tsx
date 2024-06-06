import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/utils/auth";
import { UserAccountNav } from "@/components/user-account-nav";

const Header = async () => {
  const session = auth();
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

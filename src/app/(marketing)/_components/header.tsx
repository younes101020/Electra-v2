import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "../_actions/auth";

const Header = async () => {
  return (
    <header className="flex justify-between px-4 md:px-44 py-2 bg-black/50 fixed z-50">
      <Link href="/">
        <h1 className="text-4xl">Electra</h1>
      </Link>
      <form action={auth}>
        <Button type="submit">S&apos;authentifier</Button>
      </form>
    </header>
  );
};

export { Header };

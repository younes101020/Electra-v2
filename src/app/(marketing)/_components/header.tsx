import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "../_actions/auth";

const Header = () => {
  return (
    <header className="flex justify-between px-44 py-2">
      <Link href="/">
        <h1 className="text-4xl">Electra</h1>
      </Link>
      <form action={auth}>
        <Button type="submit">S'authentifier</Button>
      </form>
    </header>
  );
};

export { Header };

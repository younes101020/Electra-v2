import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-center px-4 py-2">
      <Link href="/">
        <h1 className="text-4xl">Electra</h1>
      </Link>
    </header>
  );
};

export { Header };

import fetcher from "@/utils/http";
import { cookies } from "next/headers";
import { Card } from "./_components/card";

export default async function Approved() {
  const cookieStore = cookies();
  const request_token = cookieStore.get("request_token");
  if (!request_token) {
    throw new Error(
      "Vous n'avez pas accès à cette page, si vous souhaitez vous identifiez merci de le faire depuis la page d'accueil."
    );
  }
  const data = await fetcher(
    "https://api.themoviedb.org/4/auth/access_token",
    {
      body: JSON.stringify({ request_token: request_token.value }),
    }
  );
  // RENDER CLIENT
  return (
    <section className="absolute flex justify-center h-[80%] w-full items-center">
      <Card access_token={data.access_token} account_id={data.account_id} />
    </section>
  );
}

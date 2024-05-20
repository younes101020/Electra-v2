import { cookies } from "next/headers";
import { Card } from "./_components/card";


export default function Accueil() {
  const cookieStore = cookies()
  const user = cookieStore.get('account_details')
  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card />
    </section>
  );
}

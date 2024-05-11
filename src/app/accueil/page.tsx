import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

export default function Accueil() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="">
        <Card className="!relative">
          <CardContent className="!p-0">
            <Image
              src="https://i.pinimg.com/originals/b8/ee/9c/b8ee9c7cf0b95d728bf74f11df5e45cd.jpg"
              width={850}
              height={500}
              alt="Picture of the first position show"
            />
          </CardContent>
          <CardFooter className="flex justify-between bg-background/50 w-full bottom-0 absolute"></CardFooter>
        </Card>
      </section>
    </main>
  );
}

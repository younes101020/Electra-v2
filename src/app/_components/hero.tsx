import Image from "next/image";
import { Wave } from "./wave";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";

const Hero = () => {
  return (
    <div className="w-full relative h-[50rem]">
      <Image
        src="/img/hero_img.jpg"
        fill
        alt="Picture of the hero banner"
        className="grayscale"
      />
      <div className="z-20 absolute bg-background/75 h-full w-full py-2 px-7 flex items-center">
        <div className="lg:w-[50%] flex flex-col gap-4">
          <h2 className="text-5xl font-bold text-foreground inline-flex">
            La plateforme préférée des cinéphiles
          </h2>
          <h3 className="text-2xl">
            Rejoignez les différentes communautés autour de vos films et séries
            favoris, créez votre watchlist, notez différents séries et films...
          </h3>
          <div>
            <Button asChild>
              <Link href="/register" className="text-lg">
                S'inscrire
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute z-50 bottom-0 w-full mt-4">
        <Wave />
      </div>
    </div>
  );
};

export { Hero };

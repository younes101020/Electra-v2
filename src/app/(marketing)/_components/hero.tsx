import Image from "next/image";
import { Wave } from "./wave";
import { Button } from "@/components/ui/button";
import { auth } from "../_actions/auth";

const Hero = () => {
  return (
    <div className="relative h-[50rem] w-full">
      <Image
        src="/img/hero_img.jpg"
        fill
        alt="Picture of the hero banner"
        className="grayscale"
      />
      <div className="absolute z-20 flex h-full w-full items-center bg-background/75 px-4 pb-20 md:px-40">
        <div className="flex flex-col gap-4 lg:w-[70%]">
          <h2 className="text-5xl font-light text-foreground">
            La première application de{" "}
            <span className="font-semibold">rencontre entre cinéphiles</span>.
          </h2>
          <h3 className="text-xl font-thin">
            Rejoignez les différentes communautés autour de vos films favoris,
            créez votre watchlist, notez différents films...
          </h3>
          <div>
            <form action={auth}>
              <Button type="submit" className="text-md text-primary-foreground">
                Commencer
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 z-50 mt-4 w-full">
        <Wave />
      </div>
    </div>
  );
};

export { Hero };

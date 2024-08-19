import { Button } from "@/components/ui/button";
import { auth } from "../_actions/auth";
import { Marquee3D } from "./marquee";

const Hero = () => {
  return (
    <div className="flex h-[90vh] w-full flex-col items-center justify-center gap-20 bg-background/75 md:flex-row">
      <div className="flex flex-col gap-4 lg:w-[65%]">
        <h2 className="text-5xl font-light text-foreground">
          La première application de{" "}
          <span className="font-semibold">rencontre entre cinéphiles</span>.
        </h2>
        <h3 className="text-xl font-thin">
          Rejoignez les différentes communautés autour de vos films favoris,
          créez votre watchlist, notez différents films...
        </h3>
        <div className="flex gap-1">
          <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 25 Q 50 10, 90 25"
              className="stroke-primary"
              strokeWidth="2"
              fill="transparent"
            />
            <path
              d="M85 20 L95 25 L85 30"
              className="stroke-primary"
              strokeWidth="2"
              fill="transparent"
            />
          </svg>

          <form action={auth}>
            <Button type="submit" className="text-md text-primary-foreground">
              Commencer
            </Button>
          </form>
        </div>
      </div>
      <Marquee3D />
    </div>
  );
};

export { Hero };

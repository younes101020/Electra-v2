import { cn } from "@/lib/utils";
import Image from "next/image";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: any;
}

const poster = [
  {
    name: "Avengers",
    img: "/img/hero/avengers.jpeg",
  },
  {
    name: "Interstellar",
    img: "/img/hero/interstellar.jpeg",
  },
  {
    name: "Spiderman",
    img: "/img/hero/spiderman.jpeg",
  },
  {
    name: "Starwars",
    img: "/img/hero/starwars.jpeg",
  },
  {
    name: "SupermanVBatman",
    img: "/img/hero/supermanvbatman.jpeg",
  },
  {
    name: "The Walking Dead",
    img: "/img/hero/twd.jpeg",
  },
];

function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

export function Marquee3D() {
  return (
    <div className="relative flex h-full w-96 flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-background px-20 md:shadow-xl">
      <div className="flex flex-row gap-4 [perspective:300px]">
        <Marquee
          className="h-96 justify-center overflow-hidden [--duration:60s] [--gap:1rem]"
          vertical
          style={{
            transform:
              "translateX(0px) translateY(0px) translateZ(-50px) rotateX(0deg) rotateY(-20deg) rotateZ(10deg) scale(1.5)",
          }}
        >
          {poster.map((data, idx) => (
            <Image
              key={idx}
              width={200}
              height={300}
              src={data.img}
              alt={data.name}
              className="mx-auto h-full w-3/4 cursor-pointer rounded-xl border border-yellow-300 transition-all duration-300 hover:ring-1 hover:ring-yellow-300"
            />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ShowCard = ({
  className,
  placeNumber,
  poster_path,
}: {
  className?: string;
  placeNumber?: number;
  poster_path: string;
}) => {
  const [animation, setAnimation] = useState(false);
  const imageSize = placeNumber === 1 ? 550 : 225;
  const starSize = placeNumber === 1 ? 40 : 20;
  const fontSize = placeNumber === 1 ? "text-7xl" : "text-3xl";

  return (
    <Card className={cn("!relative h-full", className)}>
      <CardContent className="!p-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${poster_path}`}
          width={imageSize}
          height={imageSize}
          alt="Picture of the first position show"
        />
      </CardContent>
      <CardFooter className="absolute bottom-0 flex w-full flex-col items-start gap-2 bg-background/50 p-4">
        <div className="flex cursor-pointer gap-1 text-primary">
          {Array.from({ length: 5 }).map((_, index) => (
            <Icons.star
              key={index + 1}
              size={starSize}
              strokeWidth={1}
              className="fill-primary hover:scale-110"
            />
          ))}
        </div>
        <div className="flex gap-4">
          {placeNumber && (
            <h2 className={`${fontSize} font-semibold italic text-primary`}>
              #{placeNumber}{" "}
              {placeNumber === 1 && (
                <span className={`${fontSize} font-thin`}>/</span>
              )}
            </h2>
          )}

          <div className="mt-auto flex h-full gap-2">
            <Button asChild>
              <Link href="/space" className="flex gap-2">
                <Icons.message size={20} /> / Space
              </Link>
            </Button>
            <Button
              onClick={() => setAnimation(true)}
              onAnimationEnd={() => setAnimation(false)}
              className={animation ? "*:animate-wiggle" : ""}
            >
              <Icons.addBookmark size={20} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export { ShowCard };

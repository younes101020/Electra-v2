import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import defaultImage from "@/../public/img/no-image.png";
import { UseQueryResult, useMutation } from "@tanstack/react-query";
import { toggleBookmarkShowsFn } from "@/utils/api/favorite";

const ShowCard = ({
  className,
  placeNumber,
  poster_path,
  isFav,
  id,
  account_id,
  vote_average,
  refetch,
}: {
  className?: string;
  placeNumber?: number;
  poster_path: string;
  isFav: boolean;
  vote_average: number;
  account_id: string;
  id: number;
  refetch: (options: {
    throwOnError: boolean;
    cancelRefetch: boolean;
  }) => Promise<UseQueryResult>;
}) => {
  const mutation = useMutation({
    mutationFn: toggleBookmarkShowsFn,
    onSuccess: () => refetch({ cancelRefetch: true, throwOnError: true }),
  });
  const [animation, setAnimation] = useState(false);
  const imageSize = placeNumber === 1 ? 550 : 225;
  const starSize = placeNumber === 1 ? 40 : 20;
  const fontSize = placeNumber === 1 ? "text-7xl" : "text-3xl";
  const rating = Math.floor(vote_average / 2);
  return (
    <Card className={cn("!relative h-full", className)}>
      <CardContent className="flex justify-center !p-0">
        <Image
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/original${poster_path}`
              : defaultImage
          }
          width={poster_path ? imageSize : undefined}
          height={poster_path ? imageSize : undefined}
          alt="Picture of the show cover"
        />
      </CardContent>
      <CardFooter className="absolute bottom-0 flex w-full flex-col items-start gap-2 bg-background/50 p-4">
        <div className="flex cursor-pointer gap-1 text-primary">
          {Array.from({ length: 5 }).map((_, index) => (
            <Icons.star
              key={index + 1}
              size={starSize}
              strokeWidth={1}
              className={`${rating < index + 1 ? "fill-primary/25" : "fill-primary"} hover:scale-110`}
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
              {isFav ? (
                <Icons.rmvBookmark
                  size={20}
                  onClick={() => {
                    mutation.mutate({
                      accountId: account_id,
                      showId: id,
                      favorite: false,
                    });
                  }}
                />
              ) : (
                <Icons.addBookmark
                  size={20}
                  onClick={() => {
                    mutation.mutate({
                      accountId: account_id,
                      showId: id,
                      favorite: true,
                    });
                  }}
                />
              )}
            </Button>
          </div>
        </div>
      </CardFooter>
      s
    </Card>
  );
};

export { ShowCard };

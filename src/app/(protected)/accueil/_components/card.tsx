"use client";

import Image from "next/image";
import { Card as OneCard, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getShowsFn, showQueryKeys } from "@/utils/api/shows";

type CardProps = React.ComponentProps<typeof OneCard>;

export function Card({ className, ...props }: CardProps) {
  const [animation, setAnimation] = useState(false);
  const { data: shows } = useQuery({
    queryKey: showQueryKeys.all,
    queryFn: getShowsFn,
  });
  return (
    <OneCard className="!relative">
      <CardContent className="!p-0">
        <Image
          src="https://i.pinimg.com/originals/b8/ee/9c/b8ee9c7cf0b95d728bf74f11df5e45cd.jpg"
          width={850}
          height={500}
          alt="Picture of the first position show"
        />
      </CardContent>
      <CardFooter className="absolute bottom-0 flex w-full flex-col items-start bg-background/50 p-4">
        <div className="flex cursor-pointer gap-1 text-primary">
          <Icons.star
            size={40}
            strokeWidth={1}
            className="fill-primary hover:scale-110"
          />
          <Icons.star
            size={40}
            strokeWidth={1}
            className="fill-primary hover:scale-110"
          />
          <Icons.star
            size={40}
            strokeWidth={1}
            className="fill-primary hover:scale-110"
          />
          <Icons.star size={40} strokeWidth={1} className="hover:scale-110" />
          <Icons.star size={40} strokeWidth={1} className="hover:scale-110" />
        </div>
        <div className="flex gap-4">
          <h2 className="text-7xl font-semibold italic text-primary">
            #1 <span className="text-7xl font-thin">/</span>
          </h2>
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
    </OneCard>
  );
}

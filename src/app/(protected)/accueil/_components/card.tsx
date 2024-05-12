"use client";

import Image from "next/image";
import { Card as OneCard, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useState } from "react";

type CardProps = React.ComponentProps<typeof OneCard>;

export function Card({ className, ...props }: CardProps) {
  const [animation, setAnimation] = useState(false);
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
      <CardFooter className="flex flex-col items-start p-4 bg-background/50 w-full bottom-0 absolute">
        <div className="flex text-primary gap-1">
            <Icons.star size={40} strokeWidth={1} />
            <Icons.star size={40} strokeWidth={1} />
            <Icons.star size={40} strokeWidth={1} />
            <Icons.star size={40} strokeWidth={1} />
            <Icons.star size={40} strokeWidth={1} />
        </div>
        <div className="flex gap-4">
          <h2 className="text-primary font-semibold italic text-7xl">
            #1 <span className=" font-thin text-7xl">/</span>
          </h2>
          <div className="h-full mt-auto flex gap-2">
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

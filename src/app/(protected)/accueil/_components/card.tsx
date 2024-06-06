"use client";

import Image from "next/image";
import { Card as OneCard, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useState } from "react";
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { IShowResponse, getShowsFn, showQueryKeys } from "@/utils/api/shows";
import { ErrorResponse } from "@/utils/api";

type CardProps = React.ComponentProps<typeof OneCard>;

export function Card({ className, ...props }: CardProps) {
  const [animation, setAnimation] = useState(false);
  const {
    data: shows,
    fetchNextPage,
    hasNextPage,
  }: UseInfiniteQueryResult<IShowResponse, ErrorResponse> = useInfiniteQuery({
    queryKey: showQueryKeys.pagination({ pageIndex: 1, pageSize: 20 }),
    queryFn: ({ pageParam }) => getShowsFn({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage.length);
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
  console.log(shows, "k");
  return (
    <div className="grid grid-cols-7 grid-rows-5 gap-4">
      <InfiniteScroll
        loadMore={() => fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="loader" key={0}>
            Chargement ...
          </div>
        }
        element="section"
      >
        {shows?.pages.map(({ results }) =>
          results.map(({ poster_path, title, vote_average, id }, index) =>
            index === 0 ? (
              <div className="col-span-3 row-span-4">
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
                      <Icons.star
                        size={40}
                        strokeWidth={1}
                        className="hover:scale-110"
                      />
                      <Icons.star
                        size={40}
                        strokeWidth={1}
                        className="hover:scale-110"
                      />
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
              </div>
            ) : index === 1 ? (
              <div className="col-span-2 col-start-4 row-span-2">
                top 2 show
              </div>
            ) : index === 2 ? (
              <div className="col-span-2 col-start-6 row-span-2">
                top 3 show
              </div>
            ) : index === 3 ? (
              <div className="col-span-2 col-start-4 row-span-2 row-start-3">
                top 4 show
              </div>
            ) : index === 4 ? (
              <div className="col-span-2 col-start-6 row-span-2 row-start-3">
                top 5 show
              </div>
            ) : (
              <div className="col-span-2 row-span-2">others</div>
            ),
          ),
        )}
      </InfiniteScroll>
    </div>
  );
}

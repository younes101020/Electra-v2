"use client";

import { useIntersectionObserver } from "usehooks-ts";
import { ReactNode } from "react";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { IShowResponse, getShowsFn, showQueryKeys } from "@/utils/api/shows";
import { ErrorResponse } from "@/utils/api";
import { ShowCard } from "./card";
import { Spinner } from "@/components/ui/spinner";

const Section = ({
  children,
  className,
  fetchNextPage,
  isFetching,
}: {
  children: ReactNode;
  className: string;
  isFetching: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<IShowResponse, ErrorResponse>>;
}) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
    onChange: (isIntersecting) => {
      console.log(isFetching);
      if (isIntersecting && !isFetching) fetchNextPage();
    },
  });

  console.log({
    isIntersecting,
  });

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
};

export function Shows() {
  const {
    data: shows,
    fetchNextPage,
    hasNextPage,
    isFetching,
  }: UseInfiniteQueryResult<IShowResponse, ErrorResponse> = useInfiniteQuery({
    queryKey: showQueryKeys.pagination({ pageIndex: 1, pageSize: 20 }),
    queryFn: ({ pageParam }) => getShowsFn({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
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
  return (
    <>
      {shows?.pages.map(({ results }, pageIndex) => (
        <>
          <section
            className={
              pageIndex === 0
                ? "grid grid-cols-7 grid-rows-6 gap-4"
                : "flex flex-wrap gap-4 pt-4"
            }
          >
            {results
              .slice(0, 5)
              .map(({ poster_path, title, vote_average, id }, index) =>
                index === 0 && pageIndex === 0 ? (
                  <div className="col-span-3 row-span-6">
                    <ShowCard placeNumber={1} poster_path={poster_path} />
                  </div>
                ) : index === 1 && pageIndex === 0 ? (
                  <div className="col-span-2 col-start-4 row-span-3">
                    <ShowCard placeNumber={2} poster_path={poster_path} />
                  </div>
                ) : index === 2 && pageIndex === 0 ? (
                  <div className="col-span-2 col-start-4 row-span-3 row-start-4">
                    <ShowCard placeNumber={3} poster_path={poster_path} />
                  </div>
                ) : index === 3 && pageIndex === 0 ? (
                  <div className="col-span-2 col-start-6 row-span-3 row-start-1">
                    <ShowCard placeNumber={4} poster_path={poster_path} />
                  </div>
                ) : index === 4 && pageIndex === 0 ? (
                  <div className="col-span-2 col-start-6 row-span-3 row-start-4">
                    <ShowCard placeNumber={5} poster_path={poster_path} />
                  </div>
                ) : (
                  <div className="flex">
                    <ShowCard poster_path={poster_path} />
                  </div>
                ),
              )}
          </section>
        </>
      ))}
      {hasNextPage && (
        <Section
          className="flex h-28 w-full items-end justify-center"
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
        >
          <Spinner />
        </Section>
      )}
    </>
  );
}

"use client";

import { useIntersectionObserver } from "usehooks-ts";
import { Fragment, ReactNode, useState } from "react";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
  useQuery,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  IRQShowResponse,
  getRQShowsFn,
  showQueryKeys,
  IRQErrorResponse,
} from "@/utils/api/tmdb";
import { ShowCard } from "./showcard";
import { Spinner } from "@/components/ui/spinner";
import {
  favoriteShowQueryKeys,
  getBookmarkShowsFn,
} from "@/utils/api/tmdb/favorite";
import { Form } from "./form";
import { useSessionStore } from "@/providers/session";

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
  ) => Promise<InfiniteQueryObserverResult<IRQShowResponse, IRQErrorResponse>>;
}) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
    onChange: (isIntersecting) => {
      if (isIntersecting && !isFetching) fetchNextPage();
    },
  });

  return (
    <Fragment>
      <div ref={ref} className={className} key={Date.now()}>
        {children}
      </div>
    </Fragment>
  );
};

export function Shows() {
  const { id: account_id } = useSessionStore((state) => state);
  const {
    data: shows,
    fetchNextPage,
    hasNextPage,
    isFetching,
  }: UseInfiniteQueryResult<
    IRQShowResponse,
    IRQErrorResponse
  > = useInfiniteQuery({
    queryKey: showQueryKeys.pagination({ pageIndex: 1, pageSize: 20 }),
    queryFn: ({ pageParam = 1 }) =>
      getRQShowsFn({ type: "pagination", value: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.results.length === 0) {
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
  const { data: favoriteShowIds, refetch } = useQuery({
    queryKey: favoriteShowQueryKeys.all,
    queryFn: () => getBookmarkShowsFn({ accountId: account_id.toString() }),
  });

  return (
    <>
      {shows?.pages.map(({ results }, pageIndex) => (
        <>
          <section
            className={
              pageIndex === 0
                ? "grid w-full grid-cols-8 grid-rows-7 gap-4 lg:grid-cols-7 lg:grid-rows-4 mb-4"
                : "grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4"
            }
            key={pageIndex}
          >
            {results
              // When show entity is deleted from data source tmdb change the show name into "Deleted"
              .filter((show) => show.title !== "Deleted")
              // Take only 5 shows when this page concern the top shows
              .slice(
                pageIndex === 0 ? 0 : undefined,
                pageIndex === 0 ? 5 : undefined,
              )
              .map((show, index) =>
                index === 0 && pageIndex === 0 ? (
                  <div
                    className="col-span-8 row-span-3 lg:col-span-3 lg:row-span-4"
                    key={show.id}
                  >
                    <ShowCard
                      refetch={refetch}
                      isFav={
                        favoriteShowIds?.results! &&
                        favoriteShowIds.results.some(
                          (favId: number) => show.id === favId,
                        )
                      }
                      id={show.id}
                      placeNumber={1}
                      poster_path={show.poster_path}
                      vote_average={parseInt(show.vote_average)}
                    />
                  </div>
                ) : index === 1 && pageIndex === 0 ? (
                  <div
                    key={show.id}
                    className="col-span-8 col-start-1 row-span-2 row-start-4 md:col-span-4 lg:col-span-2 lg:col-start-4 lg:row-start-1"
                  >
                    <ShowCard
                      refetch={refetch}
                      isFav={
                        favoriteShowIds?.results! &&
                        favoriteShowIds.results.some(
                          (favId: number) => show.id === favId,
                        )
                      }
                      id={show.id}
                      placeNumber={2}
                      poster_path={show.poster_path}
                      vote_average={parseInt(show.vote_average)}
                    />
                  </div>
                ) : index === 2 && pageIndex === 0 ? (
                  <div
                    key={show.id}
                    className="col-span-8 col-start-1 row-span-2 row-start-6 md:col-span-4 md:col-start-5 md:row-start-4 lg:col-span-2 lg:col-start-6 lg:row-start-1"
                  >
                    <ShowCard
                      refetch={refetch}
                      isFav={
                        favoriteShowIds?.results! &&
                        favoriteShowIds.results.some(
                          (favId: number) => show.id === favId,
                        )
                      }
                      id={show.id}
                      placeNumber={3}
                      poster_path={show.poster_path}
                      vote_average={parseInt(show.vote_average)}
                    />
                  </div>
                ) : index === 3 && pageIndex === 0 ? (
                  <div
                    key={show.id}
                    className="col-span-8 col-start-1 row-span-2 row-start-8 md:col-span-4 md:row-start-6 lg:col-span-2 lg:col-start-4 lg:row-start-3"
                  >
                    <ShowCard
                      refetch={refetch}
                      isFav={
                        favoriteShowIds?.results! &&
                        favoriteShowIds.results.some(
                          (favId: number) => show.id === favId,
                        )
                      }
                      id={show.id}
                      placeNumber={4}
                      poster_path={show.poster_path}
                      vote_average={parseInt(show.vote_average)}
                    />
                  </div>
                ) : index === 4 && pageIndex === 0 ? (
                  <div
                    key={show.id}
                    className="col-span-8 col-start-1 row-span-2 row-start-10 md:col-span-4 md:col-start-5 md:row-start-6 lg:col-span-2 lg:col-start-6 lg:row-start-3"
                  >
                    <ShowCard
                      refetch={refetch}
                      isFav={
                        favoriteShowIds?.results! &&
                        favoriteShowIds.results.some(
                          (favId: number) => show.id === favId,
                        )
                      }
                      id={show.id}
                      placeNumber={5}
                      poster_path={show.poster_path}
                      vote_average={parseInt(show.vote_average)}
                    />
                  </div>
                ) : (
                  <div key={show.id}>
                    <ShowCard
                      refetch={refetch}
                      isFav={
                        favoriteShowIds?.results! &&
                        favoriteShowIds.results.some(
                          (favId: number) => show.id === favId,
                        )
                      }
                      id={show.id}
                      poster_path={show.poster_path}
                      vote_average={parseInt(show.vote_average)}
                    />
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

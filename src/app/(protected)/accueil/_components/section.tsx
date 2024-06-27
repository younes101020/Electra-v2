"use client";

import { useIntersectionObserver } from "usehooks-ts";
import { ReactElement } from "react";
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { IShowResponse, getShowsFn, showQueryKeys } from "@/utils/api/shows";
import { ErrorResponse } from "@/utils/api";
import { ShowCard } from "./card";

const Section = (props: { section: ReactElement }) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  console.log({
    isIntersecting,
  });

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        border: "1px dashed #000",
        fontSize: "2rem",
      }}
    >
      <div style={{ margin: "auto" }}>{props.section}</div>
    </div>
  );
};

export function Shows() {
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
  console.log(shows!.pages[0].results);
  return (
    <>
      {shows?.pages.map(({ results }, pageIndex) =>
        results
          .slice(0, 5)
          .map(({ poster_path, title, vote_average, id }, index) =>
            index === 0 && pageIndex === 0 ? (
              <div className="col-span-3 row-span-4">
                <ShowCard placeNumber={1} poster_path={poster_path} />
              </div>
            ) : index === 1 && pageIndex === 0 ? (
              <div className="col-span-2 col-start-4 row-span-2">
                <ShowCard placeNumber={2} poster_path={poster_path} />
              </div>
            ) : index === 2 && pageIndex === 0 ? (
              <div className="col-span-2 col-start-6 row-span-2">
                <ShowCard placeNumber={3} poster_path={poster_path} />
              </div>
            ) : index === 3 && pageIndex === 0 ? (
              <div className="col-span-2 col-start-4 row-span-2 row-start-3">
                <ShowCard placeNumber={4} poster_path={poster_path} />
              </div>
            ) : index === 4 && pageIndex === 0 ? (
              <div className="col-span-2 col-start-6 row-span-2 row-start-3">
                <ShowCard placeNumber={5} poster_path={poster_path} />
              </div>
            ) : (
              <div className="col-span-2 row-span-2">
                <ShowCard poster_path={poster_path} />
              </div>
            ),
          ),
      )}
    </>
  );
}

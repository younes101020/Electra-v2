"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { getRQShowsFn, Show, showQueryKeys } from "@/utils/api/tmdb";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { Shows } from "./show";
import {
  favoriteShowQueryKeys,
  getBookmarkShowsFn,
} from "@/utils/api/tmdb/favorite";
import { useSessionStore } from "@/providers/session";
import { ShowCard } from "./showcard";
import { Spinner } from "@/components/ui/spinner";

const placeholders = [
  "Spiderman",
  "Titanic",
  "Snowpiercer",
  "Dark Matter",
  "Desperate Lies",
];

export function Form() {
  const { id: account_id } = useSessionStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedFilter = useDebounce(searchTerm, 500);
  const { data: queryShows, isLoading } = useQuery({
    queryKey: showQueryKeys.detail(debouncedFilter),
    queryFn: () => getRQShowsFn({ type: "query", value: debouncedFilter }),
    enabled: Boolean(debouncedFilter),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const { data: favoriteMovies, refetch } = useQuery({
    queryKey: favoriteShowQueryKeys.all,
    queryFn: () => getBookmarkShowsFn({ accountId: account_id }),
  });
  return (
    <div className="flex flex-col">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      {queryShows ? (
        <section className="grid w-full grid-cols-1 gap-4 pt-10 md:grid-cols-2 lg:grid-cols-4">
          {queryShows.results.map((show) => (
            <div key={show.id}>
              <ShowCard
                account_id={account_id}
                refetch={refetch}
                isFav={
                  favoriteMovies?.results! &&
                        favoriteMovies.results.some(
                          (favMovies: Show) => show.id === favMovies.id,
                        )
                }
                id={show.id}
                poster_path={show.poster_path}
                vote_average={parseInt(show.vote_average)}
              />
            </div>
          ))}
        </section>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <Shows />
      )}
    </div>
  );
}

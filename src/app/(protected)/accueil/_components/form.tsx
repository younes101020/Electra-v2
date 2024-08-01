"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { getRQShowsFn, showQueryKeys } from "@/utils/api/tmdb";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";

export function Form() {
  const [searchTerm, setSearchTerm] = useState("");
  const placeholders = [
    "Spiderman",
    "Titanic",
    "Snowpiercer",
    "Dark Matter",
    "Desperate Lies",
  ];
  const debouncedFilter = useDebounce(searchTerm, 500);
  const { data, isLoading } = useQuery({
    queryKey: showQueryKeys.detail(debouncedFilter),
    queryFn: () => getRQShowsFn({ type: "query", value: debouncedFilter }),
    enabled: Boolean(debouncedFilter),
  });
  console.log(data, "ok");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={onSubmit}
    />
  );
}

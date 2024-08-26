"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useSessionStore } from "@/providers/session";
import { favoriteShowQueryKeys, getBookmarkShowsFn, toggleBookmarkShowsFn } from "@/utils/api/tmdb/favorite";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";

export function FavoriteCards() {
  const { id: account_id } = useSessionStore((state) => state);
  const { data: favoriteMovies, refetch } = useQuery({
    queryKey: favoriteShowQueryKeys.all,
    queryFn: () => getBookmarkShowsFn({ accountId: account_id }),
    enabled: !!account_id
  });
  const mutation = useMutation({
    mutationFn: toggleBookmarkShowsFn,
    onSuccess: () => refetch({ cancelRefetch: true, throwOnError: false }),
  });
  return favoriteMovies?.results.map(movie => (
    <FavoriteCard key={movie.id} title={movie.original_title} id={movie.id} account_id={account_id} mutate={mutation.mutate} posterPath={movie.poster_path} />
  ))
}

interface FavoriteCardProps {
  title: string;
  id: number;
  account_id: number;
  mutate: (variables: { account_id: number; showId: number; favorite: boolean }) => void;
  posterPath: string;
}

function FavoriteCard({ title, mutate, id, account_id, posterPath }: FavoriteCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="relative p-0">
        <div className="relative w-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w500${posterPath}`}
            alt={`Poster for ${title}`}
            width={500}
            height={750}
            className="w-full h-auto object-cover rounded-t-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold line-clamp-2 truncate">{title}</h3>
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          onClick={() => mutate({
            account_id,
            showId: id,
            favorite: false,
          })}
        >
          Retirer
        </Button>
      </CardFooter>
    </Card>
  );
}
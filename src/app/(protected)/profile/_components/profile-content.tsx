"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { useSessionStore } from "@/providers/session";
import {
  favoriteShowQueryKeys,
  getBookmarkShowsFn,
} from "@/utils/api/tmdb/favorite";
import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FavoriteShowCard } from "./favorite-show-card";

interface ProfileContentProps {
  accountDetails: ITMDBAccoundDetails;
}

export function ProfileContent({ accountDetails }: ProfileContentProps) {
  const { id: accountId } = useSessionStore((state) => state);

  const { data: favoriteMovies } = useQuery({
    queryKey: favoriteShowQueryKeys.all,
    queryFn: () => getBookmarkShowsFn({ accountId }),
    enabled: !!accountId,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const avatarUrl = accountDetails.avatar.tmdb.avatar_path
    ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${accountDetails.avatar.tmdb.avatar_path}`
    : null;

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center gap-6">
          <UserAvatar
            user={{
              name: accountDetails.username,
              image: avatarUrl,
            }}
            className="h-20 w-20"
          />
          <div className="flex flex-col gap-1">
            <CardTitle>{accountDetails.username}</CardTitle>
            {accountDetails.name && (
              <p className="text-muted-foreground">{accountDetails.name}</p>
            )}
            <div className="flex gap-3 text-sm text-muted-foreground">
              {accountDetails.iso_3166_1 && (
                <span>Pays : {accountDetails.iso_3166_1}</span>
              )}
              {accountDetails.iso_639_1 && (
                <span>Langue : {accountDetails.iso_639_1}</span>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Mes films favoris</h2>
          <Link
            href="/movies/favorite"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Voir tous les favoris
          </Link>
        </div>
        {favoriteMovies?.results && favoriteMovies.results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favoriteMovies.results.map((movie) => (
              <FavoriteShowCard
                key={movie.id}
                id={movie.id}
                original_title={movie.original_title}
                poster_path={movie.poster_path}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucun favori pour le moment
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
}

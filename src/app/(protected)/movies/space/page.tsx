import { getTMDBAccountId } from "@/lib/session";
import { Metadata } from "next/types";
import defaultImage from "@/../public/img/no-image.png";
import { getUserSpaces } from "@/services/space";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { leaveSpace } from "./_actions/space";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mes Spaces",
  description: "Gérez vos espaces de discussion cinéma",
};

export default async function SpacePage() {
  const tmdbAccoundId = await getTMDBAccountId();
  const userSpaces = await getUserSpaces({ userId: tmdbAccoundId });

  return (
    <div className="container mx-auto px-5 py-28 md:px-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userSpaces.map((space) => (
          <Card key={space.id} className="transition-shadow hover:shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1 text-xl font-semibold">
                {space.movie_title} Space
              </CardTitle>
              <div className="relative max-h-44 overflow-hidden">
                <Image
                  src={
                    space.movie_poster
                      ? `${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/w200${space.movie_poster}`
                      : defaultImage
                  }
                  alt={`${space.movie_title} poster`}
                  width={200}
                  height={200}
                  className="mb-4 mt-2 h-auto w-full rounded-md"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/4 rounded-b-md bg-gradient-to-t from-background/75 to-transparent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                <Icons.user className="h-5 w-5" />
                <span>/</span>
                <p>{space.users.length} participants</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Link
                href={`/movies/space/${space.showId}`}
                className="inline-block rounded-md bg-primary px-4 py-2 text-center text-primary-foreground transition-colors hover:bg-primary/75"
              >
                Rejoindre le Space
              </Link>
              <form action={leaveSpace}>
                <input type="text" name="userid" value={tmdbAccoundId} hidden />
                <input type="text" name="spaceid" value={space.id} hidden />
                <input type="text" name="movieid" value={space.showId} hidden />
                <Button type="submit" variant={"outline"}>
                  Quitter
                </Button>
              </form>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

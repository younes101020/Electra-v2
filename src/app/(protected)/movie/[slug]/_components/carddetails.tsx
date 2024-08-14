import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MovieDetails } from "@/index";
import Image from "next/image";
import { AverageChart } from "./averagechart";

type CardDetailsProps = MovieDetails;

export function CardDetails({
  original_title,
  genres,
  overview,
  tagline,
  poster_path,
  vote_average,
  vote_count,
}: CardDetailsProps) {
  return (
    <Card>
      <CardHeader className="flex-col md:flex-row space-x-2">
        <div className="w-1/2">
          {poster_path && (
            <Image
              className="rounded-md object-cover object-center transition-opacity"
              src={`${process.env.NEXT_PUBLIC_BASETMDBIMAGEURL}/original${poster_path}`}
              width={150}
              height={150}
              loading="eager"
              priority
              alt={`Full size image of ${original_title} poster`}
            />
          )}
          <div className="space-y-3">
            <CardTitle>{original_title}</CardTitle>
            <CardDescription className="flex flex-col space-x-1 space-y-1 *:w-fit">
              <p className="w-[15%]">
                {tagline.length === 0
                  ? "Aucune description disponible"
                  : tagline}
              </p>
              <div className="space-x-1 space-y-1">
                {genres.map((genre) => (
                  <Badge key={genre.id}>{genre.name}</Badge>
                ))}
              </div>
            </CardDescription>
          </div>
        </div>
        <AverageChart vote_average={vote_average} vote_count={vote_count} />
      </CardHeader>
      <Separator />
      <CardContent className="grid gap-4 pt-4">
        <h2 className="text-2xl">Résumé</h2>
        <p>{overview.length === 0 ? "Aucun résumé disponible" : overview}</p>
      </CardContent>
    </Card>
  );
}

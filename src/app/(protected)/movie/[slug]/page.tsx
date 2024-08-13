import {
  ITMDBShowDetailsResponse,
  ITMDBTrailerShowResponse,
} from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { Metadata } from "next";
import Image from "next/image";
import defaultImage from "@/../public/img/no-image.png";

type URLProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: URLProps): Promise<Metadata> {
  const showDetails = await fetcher<ITMDBShowDetailsResponse>(
    `${process.env.BASETMDBURL}/movie/${params.slug}`,
    { method: "GET" },
    {
      tmdbContext: {
        api_key: process.env.TMDB_API_KEY!,
      },
    },
  );
  return {
    title: showDetails.original_title,
    description: showDetails.tagline,
  };
}

export default async function SingleMoviePage({ params }: URLProps) {
  const showDetails = await fetcher<ITMDBShowDetailsResponse>(
    `${process.env.BASETMDBURL}/movie/${params.slug}?language=fr-FR`,
    { method: "GET" },
    {
      tmdbContext: {
        api_key: process.env.TMDB_API_KEY!,
      },
    },
  );
  const trailerVideo = await fetcher<ITMDBTrailerShowResponse>(
    `${process.env.BASETMDBURL}/movie/${params.slug}/videos?language=fr-FR`,
    { method: "GET" },
    {
      tmdbContext: {
        api_key: process.env.TMDB_API_KEY!,
      },
    },
  );
  const trailerVideoSrc = trailerVideo.results.find((e) => e.site === "YouTube");
  return (
    <div className="flex justify-center flex-wrap gap-2 px-5 py-16 *:rounded-lg">
      <Image
        className="object-cover object-center transition-opacity"
        src={
          showDetails.poster_path
            ? `https://image.tmdb.org/t/p/original${showDetails.poster_path}`
            : defaultImage
        }
        width={300}
        height={300}
        loading="eager"
        priority
        alt={`Full size image of ${showDetails.original_title} poster`}
      />
      {trailerVideoSrc && (
        <iframe
          src={`https://www.youtube.com/watch?v=${trailerVideoSrc.key}`}
          allowFullScreen
        />
      )}
    </div>
  );
}

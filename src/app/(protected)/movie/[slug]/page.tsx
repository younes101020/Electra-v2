import {
  ITMDBShowDetailsResponse,
  ITMDBTrailerShowResponse,
} from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { Metadata } from "next";
import Image from "next/image";
import defaultImage from "@/../public/img/no-image.png";
import { CardDetails } from "./_components/carddetails";
import { Characters } from "./_components/characters";

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
    `${process.env.BASETMDBURL}/movie/${params.slug}?language=fr-FR&append_to_response=credits`,
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
  const trailerVideoSrc = trailerVideo.results.find(
    (e) => e.site === "YouTube",
  );
  return (
    <div className="flex flex-col justify-center gap-4 px-10 py-16 lg:py-32 lg:px-32 *:rounded-lg md:flex-row">
      <div className="w-full md:w-2/3">
        {trailerVideoSrc && (
          <iframe
            src={`https://www.youtube.com/embed/${trailerVideoSrc.key}`}
            allowFullScreen
            className="w-full"
            height={300}
          />
        )}
        <CardDetails
          poster_path={showDetails.poster_path}
          original_title={showDetails.original_title}
          tagline={showDetails.tagline}
          overview={showDetails.overview}
          genres={showDetails.genres}
        />
      </div>
      {showDetails.credits?.cast && (
        <Characters cast={showDetails.credits?.cast} />
      )}
    </div>
  );
}

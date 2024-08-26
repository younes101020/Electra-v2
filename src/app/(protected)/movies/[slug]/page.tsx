import {
  ITMDBShowDetailsResponse,
  ITMDBTrailerShowResponse,
} from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { Metadata } from "next";
import { CardDetails } from "./_components/carddetails";
import { Characters } from "./_components/characters";
import { FinancialDetails } from "./_components/financialdetails";
import getQueryClient from "@/lib/react-query";
import { getRatedShowsFn, ratedMovieQueryKeys } from "@/utils/api/tmdb/rated";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTMDBAccountId } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

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
      tmdbContext: {},
    },
  );
  return {
    title: showDetails.original_title,
    description: showDetails.tagline,
  };
}

export default async function SingleMoviePage({ params }: URLProps) {
  const tmdbAccoundId = await getTMDBAccountId();
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ratedMovieQueryKeys.all,
    queryFn: () => getRatedShowsFn({ accountId: tmdbAccoundId }),
  });
  const showDetails = await fetcher<ITMDBShowDetailsResponse>(
    `${process.env.BASETMDBURL}/movie/${params.slug}?language=fr-FR&append_to_response=credits`,
    { method: "GET" },
    {
      tmdbContext: {},
    },
  );
  const trailerVideo = await fetcher<ITMDBTrailerShowResponse>(
    `${process.env.BASETMDBURL}/movie/${params.slug}/videos?language=fr-FR`,
    { method: "GET" },
    {
      tmdbContext: {},
    },
  );
  const trailerVideoSrc = trailerVideo.results.find(
    (e) => e.site === "YouTube",
  );
  return (
    <div className="flex flex-col justify-center gap-4 px-10 py-16 *:rounded-lg md:flex-row lg:px-32 lg:py-32">
      <div className="flex w-full flex-col gap-3 md:w-2/3">
        {trailerVideoSrc && (
          <iframe
            src={`https://www.youtube.com/embed/${trailerVideoSrc.key}`}
            allowFullScreen
            className="w-full"
            height={300}
          />
        )}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CardDetails
            id={showDetails.id}
            poster_path={showDetails.poster_path}
            original_title={showDetails.original_title}
            tagline={showDetails.tagline}
            overview={showDetails.overview}
            genres={showDetails.genres}
          />
        </HydrationBoundary>
        <FinancialDetails
          revenue={showDetails.revenue}
          budget={showDetails.budget}
        />
      </div>
      {showDetails.credits?.cast && (
        <Characters cast={showDetails.credits?.cast} />
      )}
    </div>
  );
}

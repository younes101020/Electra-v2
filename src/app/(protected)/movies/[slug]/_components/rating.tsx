"use client";

import { Icons } from "@/components/icons";
import { CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSessionStore } from "@/providers/session";
import {
  getRatedShowsFn,
  ratedMovieQueryKeys,
  setRatedShowsFn,
} from "@/utils/api/tmdb/rated";
import { useMutation, useQuery } from "@tanstack/react-query";

type RatingProps = {
  movie_id: number;
};

export function Rating({ movie_id }: RatingProps) {
  const { id: account_id } = useSessionStore((state) => state);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ratedMovieQueryKeys.all,
    queryFn: () => getRatedShowsFn({ accountId: account_id }),
    enabled: !!account_id,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const currentMovieRating = data?.results.find(
    (movie) => movie.id === movie_id,
  );
  const mutation = useMutation({
    mutationFn: setRatedShowsFn,
    onSuccess: () => refetch(),
  });
  return (
    <div className="flex w-full grow flex-col justify-center py-6 md:py-0">
      <div className="inline-flex justify-center">
        {mutation.isPending ? (
          <Spinner className="py-3" />
        ) : (
          Array.from({ length: 5 }).map((_, index) => (
            <TooltipProvider key={index + 1}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icons.star
                    onClick={() =>
                      mutation.mutate({
                        account_id,
                        showId: movie_id,
                        // Since star rate is based on a score out of 5 we need to multiply it by 2
                        rate: (index + 1) * 2,
                      })
                    }
                    strokeWidth={1}
                    className={`${currentMovieRating && parseInt(currentMovieRating.rating) / 2 >= index + 1 ? "fill-primary" : "fill-primary/25"} hover:scale-110`}
                    size={40}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{index + 1} étoile(s)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        )}
      </div>
      <CardDescription className="text-center">
        {isLoading || !data
          ? "..."
          : currentMovieRating
            ? `Tu as donné ${parseInt(currentMovieRating.rating) / 2} étoile(s) à ce film`
            : "Tu n'as pas encore noté ce film"}
      </CardDescription>
    </div>
  );
}

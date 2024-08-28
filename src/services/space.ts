import { db } from "@/lib/db";
import { ITMDBShowDetailsResponse } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { revalidateTag, unstable_cache } from "next/cache";

/**
 * This function return all space entities including: users, messages and movie reference related to a specific movie
 *
 */
export const getSpaceEntities = async ({ movieId }: { movieId: string }) => {
  const cachedSpaceEntities = unstable_cache(
    async (movieId) => {
      return await db.space.findFirst({
        where: {
          showId: movieId,
        },
        select: {
          id: true,
          message: {
            select: {
              content: true,
              id: true,
              spaceId: true,
              user: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          },
          users: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      });
    },
    ["space-entities"],
    { revalidate: 3600, tags: [`spaceentities:${movieId}`] },
  );
  const spaceEntities = cachedSpaceEntities(movieId);
  return spaceEntities;
};

/**
 * This function insert new space record into database and link the user who has initiate the space
 * User who has initiate name, id and profile image is returned
 *
 */
export const setSpaceEntities = async ({
  movieId,
  userId,
}: {
  movieId: string;
  userId: number;
}) => {
  const result = await db.space.create({
    data: {
      showId: movieId,
      users: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      users: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
    },
  });
  revalidateTag(`userspaces:${userId}`);
  revalidateTag(`spaceentities:${movieId}`);
  return result;
};

/**
 * This function add user into specific space
 *
 */
export const setUserToSpace = async ({
  spaceId,
  userId,
  movieId,
}: {
  spaceId: number;
  userId: number;
  movieId: string;
}) => {
  const result = await db.space.update({
    where: {
      id: spaceId,
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
  revalidateTag(`userspaces:${userId}`);
  revalidateTag(`spaceentities:${movieId}`);
  return result;
};

/**
 * This function retrieves all spaces that a user is attached to
 * note: cache have a lifespan of 1 hour
 *
 * @param userId The ID of the user
 * @returns An array of spaces with their details
 */
export const getUserSpaces = async ({ userId }: { userId: number }) => {
  const cachedUserSpaces = unstable_cache(
    async (userId) => {
      const spaces = await db.space.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          showId: true,
          users: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      // Fetch movie details for each space
      const spacesWithMovieDetails = await Promise.all(
        spaces.map(async (space) => {
          const movie = await fetcher<ITMDBShowDetailsResponse>(
            `${process.env.BASETMDBURL}/movie/${space.showId}?language=fr-FR`,
            { method: "GET", next: { revalidate: 3600 } },
            {
              tmdbContext: {},
            },
          );
          return {
            ...space,
            movie_title: movie.original_title,
            movie_poster: movie.poster_path,
          };
        }),
      );
      return spacesWithMovieDetails;
    },
    ["user-spaces"],
    { revalidate: 3600, tags: [`userspaces:${userId}`] },
  );
  const userSpaces = cachedUserSpaces(userId);
  return userSpaces;
};

/**
 * This function removes a user from a specific space
 *
 * @param userId The ID of the user to be removed
 * @param spaceId The ID of the space
 * @returns The updated space object
 */
export const removeUserFromSpace = async (
  userId: string,
  spaceId: string,
  movieId: string,
) => {
  const result = await db.space.update({
    where: {
      id: parseInt(spaceId),
    },
    data: {
      users: {
        disconnect: {
          id: parseInt(userId),
        },
      },
    },
  });
  revalidateTag(`userspaces:${userId}`);
  revalidateTag(`spaceentities:${movieId}`);
  return result;
};

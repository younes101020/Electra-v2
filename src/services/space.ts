import { db } from "@/lib/db";

/**
 * This function return all related space entities including: users, messages and movie reference
 * `null` value is returned when space does not exist
 *
 */
export const getSpaceEntities = async ({ movieId }: { movieId: string }) => {
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
  return await db.space.create({
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
};

/**
 * This function add user into specific space
 *
 */
export const setUserToSpace = async ({
  spaceId,
  userId,
}: {
  spaceId: number;
  userId: number;
}) => {
  return await db.space.update({
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
};

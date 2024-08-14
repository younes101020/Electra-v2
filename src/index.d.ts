// Types consumed by component

import { ITMDBShowDetailsResponse } from "@/utils/api/tmdb";

export type Message = {
  id: number;
  content: string;
  spaceId: number | null;
  user: {
    id: number;
    name: string;
    image: string | null;
  } | null;
};

export type User = Prisma.UserCreateInput & { socketID: string };

export type MovieDetails = Pick<
  ITMDBShowDetailsResponse,
  "genres" | "original_title" | "overview" | "tagline" | "poster_path"
>;

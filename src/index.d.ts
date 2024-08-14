// Types consumed by component

import { ITMDBShowDetailsResponse, Cast } from "@/utils/api/tmdb";

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

export type Casting = Pick<
  Cast,
  "original_name" | "character" | "profile_path" | "id"
>[];

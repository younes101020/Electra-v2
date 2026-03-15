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
  "genres" | "original_title" | "overview" | "tagline" | "poster_path" | "id"
>;

export type Casting = Pick<
  Cast,
  "original_name" | "character" | "profile_path" | "id"
>[];

export type FinancialDetails = Pick<
  ITMDBShowDetailsResponse,
  "revenue" | "budget"
>;

// ─── Social System Types ─────────────────────────────────────

export type UserProfile = {
  id: number;
  name: string;
  image: string | null;
};

export type FriendshipType = {
  id: number;
  senderId: number;
  sender: UserProfile;
  receiverId: number;
  receiver: UserProfile;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
  updatedAt: string;
};

export type DirectMessageType = {
  id: number;
  content: string;
  userId: number;
  user: UserProfile;
  conversationId: number;
  createdAt: string;
};

export type ConversationType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  users: {
    id: number;
    userId: number;
    user: UserProfile;
    conversationId: number;
    joinedAt: string;
  }[];
  messages: DirectMessageType[];
};

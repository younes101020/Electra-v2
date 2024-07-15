export interface ITMDBErrorResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

export interface ITMDBNewAuthTokenResp {
  request_token: string;
}

export interface ITMDBNewAuthSessionResp {
  session_id: string;
}

export interface IRQErrorResponse {
  error: string;
}

export interface Show {
  id: number;
  title: string;
  vote_average: string;
  poster_path: string;
}

export interface IRQShowResponse {
  pages: {
    results: Show[];
    total_pages: number;
    total_results: number;
  }[];
}

export interface IRQFavoriteShowResponse {
  results: number[];
}

export interface ITMDBShowResponse {
  page: number;
  results: Show[];
  total_pages: number;
  total_results: number;
}

export interface ITMDBAccoundDetails {
  avatar: {
    gravatar: {
      hash: string;
    };
    tmdb: {
      avatar_path: string;
    };
  };
  id: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  include_adult: boolean;
  username: string;
}

export { getRQShowsFn, showQueryKeys } from "./shows";

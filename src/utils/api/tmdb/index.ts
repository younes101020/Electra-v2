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

export interface ITMDBShowDetailsResponse {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Productioncompany[];
  production_countries: Productioncountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Spokenlanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ITMDBTrailerShowResponse {
  results: {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
  }[];
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
      avatar_path: string | null;
    };
  };
  id: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  include_adult: boolean;
  username: string;
}

interface Genre {
  id: string;
  name: string;
}

interface Productioncompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface Productioncountry {
  iso_3166_1: string;
  name: string;
}

interface Spokenlanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export { getRQShowsFn, showQueryKeys } from "./shows";

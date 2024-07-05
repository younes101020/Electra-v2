export interface ErrorResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

export interface Show {
  id: number;
  title: string;
  vote_average: string;
  poster_path: string;
}

export interface IShowResponse {
  pages: {
    results: Show[];
    total_pages: number;
    total_results: number;
  }[];
}

export { getShowsFn, showQueryKeys } from "./shows";

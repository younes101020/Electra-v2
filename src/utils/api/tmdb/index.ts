export interface ITMDBErrorResponse {
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

export interface IRQShowResponse {
  pages: {
    results: Show[];
    total_pages: number;
    total_results: number;
  }[];
}

export interface ITMDBShowResponse {
  page: number;
  results: Show[];
  total_pages: 617;
  total_results: 12331;
}

export { getRQShowsFn, showQueryKeys } from "./shows";

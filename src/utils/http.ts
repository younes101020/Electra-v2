import { ITMDBStatusResponse, ITMDBShowResponse } from "./api/tmdb";

type IHeaders =
  | {
      method: string;
      headers: { [key: string]: string };
    }
  | {};

type ICtx = {
  tmdbContext?: {
    session_id?: string;
    account_id?: string;
  };
  nextproxyContext?: {};
};

type ICtxName = keyof ICtx;

/**
 * This function constructs urls according to the calling context
 *
 * @param url - The resource url
 * @param options - Object containing options to configure the request, if not supplied, the default method will be POST and not GET, and the default header content-type will be application/json.
 * @param ctx - An object that represents the calling context
 * @returns The result of the fetch call in json format
 *
 */
export default async function fetcher<IData>(
  url: string,
  options: IHeaders = {},
  ctx: ICtx = {},
): Promise<IData> {
  try {
    if (ctx && ctx.tmdbContext) {
      const showUrl = new URL(url);
      showUrl.searchParams.set("api_key", process.env.TMDB_API_KEY!);
      // In the case of account id retrieval, we need to supply the session id
      // reminder: session_id is only needed for mutation purpose like adding ratings
      if (ctx?.tmdbContext?.session_id) {
        showUrl.searchParams.set("session_id", ctx?.tmdbContext?.session_id);
      }
      const tmdbResponse = await baseFetch<
        ITMDBShowResponse,
        ITMDBStatusResponse
      >(showUrl, options, "tmdbContext");
      const tmdbErrorResponse = tmdbResponse as ITMDBStatusResponse;
      // Throw error except when we cannot found movie details because we will redirect user for this specific case
      if (tmdbErrorResponse.success === false && tmdbErrorResponse.status_code !== 34)
        throw Error(tmdbErrorResponse.status_message);
      return tmdbResponse as IData;
    }
    const showsResponse = await baseFetch<
      ITMDBShowResponse,
      ITMDBStatusResponse
    >(url, options, "nextproxyContext");
    return showsResponse as IData;
  } catch (error) {
    throw error;
  }
}

const baseFetch = async <IData, IError>(
  url: URL | string,
  options: IHeaders,
  ctxName: ICtxName,
): Promise<IData | IError> => {
    const response = await fetch(url, updateOptions(options, ctxName));
    const result = await response.json();
    return result as IData;
};

const updateOptions = (options: IHeaders, ctxName: ICtxName) => {
  const update = { ...options };
  if (!update.method) {
    update.method = "POST";
  }
  switch (ctxName) {
    case "tmdbContext":
      update.headers = {
        ...update.headers,
        Authorization: "Bearer " + process.env.TMDB_ACCESS_TOKEN,
        "Content-Type": "application/json",
      };
      break;
  }
  return update;
};

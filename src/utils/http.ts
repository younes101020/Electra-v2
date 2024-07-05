type IHeaders =
  | {
      method: string;
      headers: { [key: string]: string };
    }
  | {};

type ICtx = {
  tmdbContext?: {
    api_key: string;
    session_id?: string;
    account_id?: string;
  };
};

const updateOptions = (options: IHeaders) => {
  const update = { ...options };
  if (!update.method) {
    update.method = "POST";
  }
  update.headers = {
    Authorization: "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
    "Content-Type": "application/json",
  };
  return update;
};

const baseFetch = async (url: URL, options: IHeaders) => {
  const response = await fetch(url, updateOptions(options));
  if (!response.ok) {
    console.log(url.href);
    throw new Error(await response.text());
  }
  const result = await response.json();
  return result;
};

/**
 * This function constructs urls according to the calling context
 *
 * @param url - The resource url
 * @param options - Object containing options to configure the request, if not supplied, the default method will be POST and not GET, and the default header content-type will be application/json.
 * @param ctx - An object that represents the calling context
 * @returns The result of the fetch call in json format
 *
 */
export default async function fetcher(
  url: string,
  options: IHeaders = {},
  ctx: ICtx,
) {
  if (ctx.tmdbContext) {
    const showUrl = new URL(url);
    showUrl.searchParams.set("api_key", ctx?.tmdbContext?.api_key);
    // In the case of account id retrieval, we need to supply the session id
    if (ctx?.tmdbContext?.session_id) {
      showUrl.searchParams.set("session_id", ctx?.tmdbContext?.session_id);
    }
    const response = await baseFetch(showUrl, options);
    return response;
  }
}

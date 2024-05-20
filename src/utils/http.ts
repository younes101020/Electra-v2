type IHeaders =
  | {
      method: string;
      headers: { [key: string]: string };
    }
  | {};

function updateOptions(options: IHeaders, url: string) {
  const update = { ...options };
  if (!update.method) {
    update.method = "POST";
  }
  if (!url.startsWith(process.env.NEXT_PUBLIC_BASEURL!)) {
    update.headers = {
      ...update.headers,
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    };
  }

  return update;
}

export default function fetcher(url: string, options: IHeaders = {}) {
  return fetch(url, updateOptions(options, url));
}

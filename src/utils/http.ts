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

export default async function fetcher(url: string, options: IHeaders = {}) {
  const response = await fetch(url, updateOptions(options, url));
  if (!response.ok) {
    console.log(await response.text(), "ok")
    throw new Error(response.statusText);
  }
  const result = await response.json();
  return result;
}

"use server";

import { revalidateTag } from "next/cache";

export async function RevalidateOrmCache(formData: FormData) {
  const movieId = formData.get("movieid") as string;
  revalidateTag(`spaceentities:${movieId}`);
}

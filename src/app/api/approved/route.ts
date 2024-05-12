import { authSchema } from "@/lib/zod/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();
  const data = authSchema.safeParse(res);
  if (!data.success) {
    const { errors } = data.error;
    return Response.json(errors, { status: 400 });
  }
  cookies().set("access_token", data.data.access_token);
  cookies().set("account_id", data.data.account_id);
  return Response.json({ message: "Authed successfully" });
}

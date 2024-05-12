import { z } from "zod";

export const authSchema = z.object({
  access_token: z.string(),
  account_id: z.string(),
});

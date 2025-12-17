import { z } from "zod";
import { emailSchema } from "@/schemas/model/user/user-schema";

export const changeEmailSchema = z.object({
  newEmail: emailSchema,
});

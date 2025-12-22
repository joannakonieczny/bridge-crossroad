import { z } from "zod";
import { emailSchema } from "../../../model/user/user-schema";

export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

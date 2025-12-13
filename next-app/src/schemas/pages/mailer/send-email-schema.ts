import { z } from "zod";

export const sendEmailSchema = z.object({
  email: z.string().email(),
  title: z.string().min(1),
  body: z.string().min(1),
});
import { z } from "zod";

export const cezarPlayerSchema = z.object({
  pid: z.string().min(1),
  fullName: z.string().min(1),
  wk: z.string().min(1),
  klub: z.string().nullable(),
  okreg: z.string().min(1),
});

export type CezarPlayer = z.infer<typeof cezarPlayerSchema>;

"server-only";

import { z } from "zod";

const envSchema = z.object({
  SESSION_SECRET: z.string().default("123"),
  EXPIRATION_TIME_SECONDS: z.coerce.number().default(3600),
  SECURE_COOKIES: z.coerce.boolean().default(false),
  MONGODB_URI: z.string(),
  MONGODB_DB_NAME: z.string(),
});
export type EnvVariables = z.infer<typeof envSchema>;

//////
// EXECUTION

const environment = envSchema.safeParse(process.env);

if (!environment.success) {
  console.error("FATAL ERROR: Environment validation failed:");
  environment.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join(".")} : ${issue.message}`);
  });
  process.exit(1);
}

export const config: EnvVariables = environment.data;

"server-only";

import { z } from "zod";

const envSchema = z.object({
  SESSION_SECRET: z.string(),
  EXPIRATION_TIME_SECONDS: z.coerce.number(),
  SECURE_COOKIES: z.coerce.boolean(),
  MONGODB_URI: z.string(),
  MONGODB_DB_NAME: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_SESSION_TOKEN: z.string(),
});
export type EnvVariables = z.infer<typeof envSchema>;

const fallbackSecret = {
  SESSION_SECRET: "123",
  EXPIRATION_TIME_SECONDS: 3600,
  SECURE_COOKIES: false,
} satisfies Partial<EnvVariables>;

//////
// EXECUTION

const environment = envSchema.safeParse(process.env);

const errors: string[] = [];
const warnings: string[] = [];
environment.error?.issues.forEach((issue) => {
  const path = issue.path.join(".");
  if (path in fallbackSecret) {
    warnings.push(
      `[ENV LOADER] WARNING : ${path} : using fallback value : ${
        fallbackSecret[path as keyof typeof fallbackSecret]
      }`
    );
  } else {
    errors.push(`[ENV LOADER] FATAL ERROR : ${path} : ${issue.message}`);
  }
});

warnings.forEach((w) => console.warn(w));
errors.forEach((e) => console.error(e));
if (errors.length > 0) {
  console.error("[ENV LOADER] FATAL ERROR: Environment validation failed.");
  process.exit(1);
}

export const config: EnvVariables = envSchema.parse({
  ...fallbackSecret,
  ...process.env,
});

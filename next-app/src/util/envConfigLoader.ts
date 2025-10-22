"server-only";

function getEnvVar(key: string, fallback?: string) {
  const value = process.env[key];
  if (value !== undefined) return value;
  if (fallback !== undefined) {
    console.warn(
      `Environment variable (${key}) is not set. Using fallback value: ${fallback}`
    );
    return fallback;
  }
  throw new Error(
    `Missing required environment variable (${key}) and no fallback is defined`
  );
}

type Config = {
  SESSION_SECRET: string;
  EXPIRATION_TIME_MS: number;
  SECURE_COOKIES: boolean;
  MONGODB_URI: string;
  MONGODB_DB_NAME: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_SESSION_TOKEN: string;
  S3_BUCKET_NAME: string;
  URL_EXPIRATION_TIME_SECONDS: number;
};

export const config: Config = {
  SESSION_SECRET: getEnvVar("SESSION_SECRET", "123"),
  EXPIRATION_TIME_MS: Number(getEnvVar("EXPIRATION_TIME", "3600")) * 1000, // 3600000 ms = 3600 s = 60 min = 1h
  SECURE_COOKIES: Boolean(getEnvVar("SECURE_COOKIES", "false")),
  MONGODB_URI: getEnvVar("MONGODB_URI"),
  MONGODB_DB_NAME: getEnvVar("MONGODB_DB_NAME"),
  AWS_REGION: getEnvVar("AWS_REGION"),
  AWS_ACCESS_KEY_ID: getEnvVar("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: getEnvVar("AWS_SECRET_ACCESS_KEY"),
  AWS_SESSION_TOKEN: getEnvVar("AWS_SESSION_TOKEN"),
  S3_BUCKET_NAME: getEnvVar("S3_BUCKET_NAME"),
  URL_EXPIRATION_TIME_SECONDS: Number(
    getEnvVar("URL_EXPIRATION_TIME_SECONDS", "60")
  ),
};

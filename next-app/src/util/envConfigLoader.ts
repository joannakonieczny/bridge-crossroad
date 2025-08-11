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
}

export const config: Config = {
  SESSION_SECRET: getEnvVar("SESSION_SECRET", "123"),
  EXPIRATION_TIME_MS: Number(getEnvVar("EXPIRATION_TIME", "3600")) * 1000, // 3600000 ms = 3600 s = 60 min = 1h
  SECURE_COOKIES: Boolean(getEnvVar("SECURE_COOKIES", "false")),
  MONGODB_URI: getEnvVar("MONGODB_URI"),
  MONGODB_DB_NAME: getEnvVar("MONGODB_DB_NAME"),
};

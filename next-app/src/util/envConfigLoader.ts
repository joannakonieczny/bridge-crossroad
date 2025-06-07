function getEnvVar(key: string, fallback?: string): string {
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

interface Config {
  SESSION_SECRET: string;
  EXPIRATION_TIME_MS: number;
  SECURE_COOKIES: boolean;
  MONGO_URI: string
}

export const config: Config = {
  SESSION_SECRET: getEnvVar("SESSION_SECRET", "123"),
  EXPIRATION_TIME_MS: Number(getEnvVar("EXPIRATION_TIME", "3600")) * 1000, // 3600000 ms = 3600 s = 60 min = 1h
  SECURE_COOKIES: Boolean(getEnvVar("SECURE_COOKIES", "false")),
  MONGO_URI: getEnvVar("MONGO_URI", "mongodb+srv://")
};

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable (${key}) and no fallback is defined`);
}

export const config = {
  SESSION_SECRET: getEnvVar("SESSION_SECRET", "123"),
  // 3600000 ms = 3600 s = 60 min = 1h
  EXPIRATION_TIME_MS: Number(getEnvVar("EXPIRATION_TIME", "3600")) * 1000
};

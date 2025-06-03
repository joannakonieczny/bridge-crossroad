export type Locale = (typeof locales)[number];

// same lang as in html lang attribute
export const locales = ["pl"] as const; // Define the available locales
export const defaultLocale: Locale = "pl";

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${key}`);
}

export const config = {
  SESSION_SECRET: getEnvVar("SESSION_SECRET", "123"),
  EXPIRATION_TIME: Number(getEnvVar("EXPIRATION_TIME_MS", "3600000"))
};

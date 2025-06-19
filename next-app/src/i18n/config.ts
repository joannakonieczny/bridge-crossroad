export type Locale = (typeof locales)[number];

// same lang as in html lang attribute
export const locales = ["pl"] as const; // Define the available locales
export const defaultLocale: Locale = "pl";
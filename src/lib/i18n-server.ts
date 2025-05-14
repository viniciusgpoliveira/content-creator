import { enTranslations } from "./translations";

/**
 * Simple server-side translation function
 * @returns A function that can be used to translate keys
 */
export async function getTranslations() {
  // In a real app, this would get the locale from the request or cookies
  const locale = "en";

  // Return a function that can be used to translate keys
  return function translate(key: string, params?: Record<string, string>): string {
    // Split the key by dots to access nested properties
    const keys = key.split(".");

    // Get the translations for the current locale
    const translations = enTranslations;

    // Navigate through the nested properties
    let result: any = translations;
    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = result[k];
      } else {
        // If the key doesn't exist, return the key itself
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // If the result is not a string, return the key
    if (typeof result !== "string") {
      console.warn(`Translation result is not a string for key: ${key}`);
      return key;
    }

    // Replace parameters if any
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{{${paramKey}}}`, "g"), paramValue);
      }, result);
    }

    return result;
  };
}

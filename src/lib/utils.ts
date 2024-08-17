import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * This function handle classname priority
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This function allow to format number into usd currency
 */
export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * This is helper function for extracting ``session_id_placeholder`` literal from end user request pathname when reaching our internal api
 * and replace it by the real session_id, replacement is done on middleware
 *
 * note: returned value is an object including pathname without the literal ``session_id_placeholder``
 */
export function getPathsAroundPlaceholder(pathname: string) {
  const parts = pathname.split("/");
  const placeholderIndex = parts.indexOf("session_id_placeholder");

  if (placeholderIndex > 1) {
    const beforePlaceholder = parts[placeholderIndex - 1];
    const afterPlaceholder = parts.slice(placeholderIndex + 1).join("/");
    return {
      before: beforePlaceholder,
      after: afterPlaceholder,
    };
  }

  return null;
}

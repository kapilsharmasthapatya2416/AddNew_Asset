export const MAX_SANITIZED_INPUT_LENGTH = 100;

/**
 * Performs basic sanitization of user-provided text for safer UI display.
 * Strips HTML tags and some hazardous patterns, but is not a full XSS or
 * injection sanitizer and should not be relied on as a security boundary.
 * NOTE: We avoid manual HTML entity encoding here because React/Next.js
 * automatically escapes content rendered in JSX, preventing double-encoding issue.
 * @param input The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input) return '';

  return input
    .trim() // Trim leading and trailing whitespace first
    .replace(/<[^>]*>/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/(^|\s)on\w+\s*=/gi, '$1') // Remove event handlers like onclick= while preserving leading whitespace
    .slice(0, MAX_SANITIZED_INPUT_LENGTH);
}

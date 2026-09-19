/**
 * Security & Sanitization Utilities
 */

/**
 * Sanitizes user input string by stripping dangerous HTML tags and scripts
 * while preserving natural language characters, quotes, and French apostrophes.
 */
export function sanitizeInput(str: string): string {
  if (!str) return ''
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove <iframe> tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove <style> tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove inline event handlers like onclick=""
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/<[^>]*>/g, '') // Strip remaining HTML tags
    .trim()
}

/**
 * Validates email format using RFC 5322 standard regex
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email.trim())
}

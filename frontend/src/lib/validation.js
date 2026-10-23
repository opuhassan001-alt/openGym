/**
 * Enterprise Form Validation & Anti-Spam Protection Suite
 * Zero-dependency, industrial-grade input hygiene & bot mitigation
 */

// RFC 5322 compliant email validator
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return { valid: false, error: 'Email address is required.' };
  const trimmed = email.trim();
  if (trimmed.length > 254) return { valid: false, error: 'Email exceeds maximum allowable length.' };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, error: 'Please enter a valid email format (e.g. athlete@example.com).' };
  return { valid: true, value: trimmed.toLowerCase() };
}

export function validateString(input, min = 1, max = 500, fieldName = 'Field') {
  if (typeof input !== 'string') return { valid: false, error: `${fieldName} is invalid.` };
  const clean = input.trim();
  if (clean.length < min) return { valid: false, error: `${fieldName} must be at least ${min} characters.` };
  if (clean.length > max) return { valid: false, error: `${fieldName} cannot exceed ${max} characters.` };
  return { valid: true, value: clean };
}

/**
 * XSS & Script Injection Neutralizer
 * Encodes dangerous characters to prevent HTML/DOM-based injection
 */
export function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Anti-Bot Honeypot Validator
 * Checks hidden honeypot fields that automated spam bots invariably fill out
 */
export function isSpamBot(formData = {}) {
  // 1. Classic hidden trap fields
  if (formData.hp_website || formData.hp_comments || formData.hp_confirm_email) {
    return true;
  }
  // 2. Submission timestamp speed test: bots submit within < 400ms of form generation
  if (formData.timestamp) {
    const elapsed = Date.now() - Number(formData.timestamp);
    if (elapsed < 450) {
      return true; // Unhumanly fast submission
    }
  }
  return false;
}

/**
 * Client-Side Rate Limiting / Debounce Wrapper
 */
export function createRateLimiter(maxCalls = 5, windowMs = 10000) {
  let callTimestamps = [];
  return function allow() {
    const now = Date.now();
    callTimestamps = callTimestamps.filter(t => now - t < windowMs);
    if (callTimestamps.length >= maxCalls) {
      return false; // Rate limit exceeded
    }
    callTimestamps.push(now);
    return true;
  };
}


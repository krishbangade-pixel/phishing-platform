/**
 * Validate URL string
 * Ensures non-empty, proper HTTP/HTTPS format, length constraints
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { valid: false, error: 'URL field cannot be empty.' };
  }

  const trimmed = url.trim();

  if (trimmed.length > 2048) {
    return { valid: false, error: 'URL exceeds maximum allowed length of 2048 characters.' };
  }

  // Check protocol or prepend http if basic domain
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = 'https://' + candidate;
  }

  try {
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS protocols are supported.' };
    }
    return { valid: true, normalizedUrl: candidate };
  } catch (err) {
    return { valid: false, error: 'Please enter a valid, well-formed URL (e.g. https://example.com).' };
  }
}

/**
 * Validate Email analysis form
 */
export function validateEmailScan({ subject, content }) {
  if (!subject || !subject.trim()) {
    return { valid: false, error: 'Email subject is required.' };
  }

  if (subject.trim().length > 255) {
    return { valid: false, error: 'Subject cannot exceed 255 characters.' };
  }

  if (!content || !content.trim()) {
    return { valid: false, error: 'Email body content is required.' };
  }

  if (content.trim().length > 20000) {
    return { valid: false, error: 'Email body content exceeds maximum limit of 20,000 characters.' };
  }

  return { valid: true };
}

/**
 * Validate Message analysis form
 */
export function validateMessageScan(content) {
  if (!content || !content.trim()) {
    return { valid: false, error: 'Message content is required.' };
  }

  if (content.trim().length > 5000) {
    return { valid: false, error: 'Message content exceeds maximum limit of 5,000 characters.' };
  }

  return { valid: true };
}

/**
 * Validate Email address format
 */
export function validateEmailFormat(email) {
  if (!email || !email.trim()) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validate Auth signup fields
 */
export function validateSignup({ fullName, email, password, confirmPassword }) {
  if (!fullName || !fullName.trim()) {
    return { valid: false, error: 'Full name is required.' };
  }
  if (!email || !email.trim() || !validateEmailFormat(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match.' };
  }
  return { valid: true };
}

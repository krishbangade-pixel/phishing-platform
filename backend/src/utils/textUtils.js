export function sanitizeText(text, maxLength = 20000) {
  if (typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength);
  }
  return trimmed;
}

export function extractUrlsFromText(text, maxUrls = 5) {
  if (!text || typeof text !== 'string') return [];

  // Match URLs starting with http://, https://, or plain www.
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"{}|\\^`[\]]+/gi;
  const matches = text.match(urlRegex) || [];

  const uniqueUrls = [];
  for (let url of matches) {
    // Strip trailing punctuation like ., !, ), etc.
    let cleaned = url.replace(/[.,;:!?)]+$/, '');
    if (!/^https?:\/\//i.test(cleaned)) {
      cleaned = 'http://' + cleaned;
    }

    if (!uniqueUrls.includes(cleaned)) {
      uniqueUrls.push(cleaned);
    }

    if (uniqueUrls.length >= maxUrls) {
      break;
    }
  }

  return uniqueUrls;
}

export function containsKeywords(text, keywordList) {
  if (!text || typeof text !== 'string' || !Array.isArray(keywordList)) {
    return [];
  }

  const lowerText = text.toLowerCase();
  const matched = [];

  for (const keyword of keywordList) {
    const lowerKeyword = keyword.toLowerCase();
    // Word boundary match or substring for longer multi-word phrases
    if (lowerKeyword.includes(' ')) {
      if (lowerText.includes(lowerKeyword)) {
        matched.push(keyword);
      }
    } else {
      const regex = new RegExp(`\\b${escapeRegExp(lowerKeyword)}\\b`, 'i');
      if (regex.test(lowerText)) {
        matched.push(keyword);
      }
    }
  }

  return matched;
}

export function generateSafePreview(text, maxLength = 150) {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength) + '...';
}

export function validateEmailFormat(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

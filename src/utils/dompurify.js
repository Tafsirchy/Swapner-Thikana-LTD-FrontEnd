import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * @param {string} html - The raw HTML string to sanitize.
 * @returns {string} - The sanitized HTML string.
 */
export const sanitize = (html) => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  });
};

export default sanitize;

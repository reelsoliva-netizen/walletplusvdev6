const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  let sanitized = input.trim();
  
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
};

export const sanitizeNumber = (input: string | number): number => {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  return isNaN(num) || !isFinite(num) ? 0 : num;
};

export const sanitizeAmount = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) || !isFinite(num) ? 0 : Math.abs(num);
};

export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateURL = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

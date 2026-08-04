export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');

/**
 * Prepends the backend API base URL to relative paths.
 * If VITE_API_BASE_URL is not set, it defaults to http://localhost:8080 when running on localhost.
 *
 * @param {string} path - The relative path (e.g. '/api/v1/linkin/ping')
 * @returns {string} The fully qualified or relative URL
 */
export const getApiUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

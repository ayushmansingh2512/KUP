export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Prepends the backend API base URL to relative paths.
 * If VITE_API_BASE_URL is not set, it returns the relative path unchanged,
 * which works seamlessly with the local Vite dev server proxy.
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

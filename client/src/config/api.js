const trimTrailingSlash = (url) => url.replace(/\/$/, '');

export const API_URL = trimTrailingSlash(import.meta.env.VITE_API_URL || 'http://localhost:8080');
export const AI_API_URL = trimTrailingSlash(import.meta.env.VITE_AI_API_URL || 'http://localhost:5000');

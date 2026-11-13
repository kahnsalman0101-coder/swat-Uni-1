import apiRequest from './client.js';
import { toSearchParams } from '../utils/format.js';

/**
 * GET /api/programs — search, filter, sort and paginate the directory.
 *
 * @param {object} query Filter/pagination state read from the URL.
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object[], meta: object, facets: object }>}
 */
export function fetchPrograms(query, signal) {
  return apiRequest('/programs', { params: toSearchParams(query), signal });
}

/**
 * GET /api/programs/:slug — full program detail plus related programs.
 *
 * @param {string} slug
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object }>}
 */
export function fetchProgram(slug, signal) {
  return apiRequest(`/programs/${encodeURIComponent(slug)}`, { signal });
}

/**
 * GET /api/programs/filters — option lists used to render the sidebar.
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object }>}
 */
export function fetchFilterOptions(signal) {
  return apiRequest('/programs/filters', { signal });
}

/**
 * GET /api/stats — headline counts for the home page stat band.
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object }>}
 */
export function fetchStats(signal) {
  return apiRequest('/stats', { signal });
}

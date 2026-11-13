import apiRequest from './client.js';
import { toSearchParams } from '../utils/format.js';

/**
 * GET /api/content — news, announcements, events, tenders and jobs.
 *
 * @param {{ category?: string|string[], q?: string, page?: number, limit?: number }} query
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object[], meta: object, counts: object, categories: object[] }>}
 */
export function fetchContent(query = {}, signal) {
  return apiRequest('/content', { params: toSearchParams(query), signal });
}

/**
 * GET /api/pages — index of the long-form pages.
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object[] }>}
 */
export function fetchPages(signal) {
  return apiRequest('/pages', { signal });
}

/**
 * GET /api/pages/:slug — a single long-form page with its body.
 *
 * @param {string} slug
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object }>}
 */
export function fetchPage(slug, signal) {
  return apiRequest(`/pages/${encodeURIComponent(slug)}`, { signal });
}

/**
 * GET /api/campuses
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object[] }>}
 */
export function fetchCampuses(signal) {
  return apiRequest('/campuses', { signal });
}

/**
 * GET /api/faculties — faculties with their departments nested.
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ data: object[] }>}
 */
export function fetchFaculties(signal) {
  return apiRequest('/faculties', { signal });
}

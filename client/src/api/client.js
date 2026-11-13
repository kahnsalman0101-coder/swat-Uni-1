import { API_BASE_URL } from '../utils/constants.js';

/**
 * Minimal fetch wrapper: joins the base URL, parses JSON, and normalises the
 * API error envelope ({ error: { status, message } }) into a real Error.
 *
 * @param {string} path Path beginning with a slash, e.g. "/programs".
 * @param {{ params?: URLSearchParams, signal?: AbortSignal }} [options]
 * @returns {Promise<any>} Parsed JSON body.
 */
export async function apiRequest(path, options = {}) {
  const { params, signal } = options;
  const queryString = params && params.toString() ? `?${params.toString()}` : '';
  const url = `${API_BASE_URL}${path}${queryString}`;

  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal
    });
  } catch (networkError) {
    if (networkError.name === 'AbortError') throw networkError;
    throw new Error(
      'Unable to reach the programs service. Confirm the API server is running on port 5000.'
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload && payload.error && payload.error.message) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export default apiRequest;

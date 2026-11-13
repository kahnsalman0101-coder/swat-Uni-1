import { useAsyncData } from './useAsyncData.js';
import {
  fetchContent,
  fetchPage,
  fetchPages,
  fetchCampuses,
  fetchFaculties
} from '../api/siteApi.js';

/**
 * Loads a page of editorial content, optionally narrowed to one category.
 *
 * @param {{ category?: string, q?: string, page?: number, limit?: number }} query
 * @returns {{ items: object[], meta: object|null, counts: object|null, categories: object[], loading: boolean, error: Error|null, reload: () => void }}
 */
export function useContent(query = {}) {
  const queryKey = JSON.stringify(query);
  const { data, loading, error, reload } = useAsyncData(
    (signal) => fetchContent(query, signal),
    [queryKey]
  );

  return {
    items: (data && data.data) || [],
    meta: (data && data.meta) || null,
    counts: (data && data.counts) || null,
    categories: (data && data.categories) || [],
    loading,
    error,
    reload
  };
}

/** Loads the index of long-form pages. */
export function usePages() {
  const { data, loading, error, reload } = useAsyncData((signal) => fetchPages(signal), []);
  return { pages: (data && data.data) || [], loading, error, reload };
}

/** Loads a single long-form page by slug. */
export function usePage(slug) {
  const { data, loading, error, reload } = useAsyncData(
    (signal) => fetchPage(slug, signal),
    [slug]
  );
  return { page: (data && data.data) || null, loading, error, reload };
}

/** Loads the campuses with their department and programme counts. */
export function useCampuses() {
  const { data, loading, error, reload } = useAsyncData((signal) => fetchCampuses(signal), []);
  return { campuses: (data && data.data) || [], loading, error, reload };
}

/** Loads the faculties with their departments nested. */
export function useFaculties() {
  const { data, loading, error, reload } = useAsyncData((signal) => fetchFaculties(signal), []);
  return { faculties: (data && data.data) || [], loading, error, reload };
}

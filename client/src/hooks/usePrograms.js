import { useAsyncData } from './useAsyncData.js';
import { fetchPrograms } from '../api/programsApi.js';

/**
 * Loads a page of the program directory whenever the query changes.
 *
 * @param {object} query Filter/pagination state derived from the URL.
 * @returns {{ programs: object[], meta: object|null, facets: object|null, loading: boolean, error: Error|null, reload: () => void }}
 */
export function usePrograms(query) {
  const queryKey = JSON.stringify(query);
  const { data, loading, error, reload } = useAsyncData(
    (signal) => fetchPrograms(query, signal),
    [queryKey]
  );

  return {
    programs: (data && data.data) || [],
    meta: (data && data.meta) || null,
    facets: (data && data.facets) || null,
    loading,
    error,
    reload
  };
}

export default usePrograms;

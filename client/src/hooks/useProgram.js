import { useAsyncData } from './useAsyncData.js';
import { fetchProgram, fetchFilterOptions, fetchStats } from '../api/programsApi.js';

/** Loads one program (detail payload) by slug. */
export function useProgram(slug) {
  const { data, loading, error, reload } = useAsyncData(
    (signal) => fetchProgram(slug, signal),
    [slug]
  );

  return {
    program: (data && data.data) || null,
    loading,
    error,
    reload
  };
}

/** Loads the static option lists used by the filter sidebar. */
export function useFilterOptions() {
  const { data, loading, error, reload } = useAsyncData(
    (signal) => fetchFilterOptions(signal),
    []
  );

  return { filters: (data && data.data) || null, loading, error, reload };
}

/** Loads the headline counters shown on the home page. */
export function useStats() {
  const { data, loading, error, reload } = useAsyncData(
    (signal) => fetchStats(signal),
    []
  );

  return { stats: (data && data.data) || null, loading, error, reload };
}

export default useProgram;

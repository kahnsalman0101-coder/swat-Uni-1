import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async loader on mount, whenever `deps` change, and whenever `reload`
 * is called. In-flight requests are cancelled on cleanup. The loader receives
 * an AbortSignal and may change identity on every render — only `deps` and
 * `reload` trigger a refetch.
 *
 * @param {(signal: AbortSignal) => Promise<any>} loader
 * @param {unknown[]} deps
 * @returns {{ data: any, loading: boolean, error: Error|null, reload: () => void }}
 */
export function useAsyncData(loader, deps = []) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setState((previous) => ({ ...previous, loading: true, error: null }));

    loaderRef
      .current(controller.signal)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!active || error.name === 'AbortError') return;
        setState({ data: null, loading: false, error });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  return { ...state, reload };
}

export default useAsyncData;

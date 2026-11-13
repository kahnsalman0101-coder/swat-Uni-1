import { useEffect, useState } from 'react';

/**
 * Returns `value` after it has stayed unchanged for `delay` milliseconds.
 * Used to keep the search box responsive while limiting API calls.
 *
 * @param {*} value
 * @param {number} delay
 */
export function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebouncedValue;

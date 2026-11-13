import { useEffect } from 'react';

const SITE_NAME = 'University of Swat';

/**
 * Keeps document.title in sync with the current page.
 *
 * @param {string} [title] Page title; the site name is appended automatically.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}

export default useDocumentTitle;

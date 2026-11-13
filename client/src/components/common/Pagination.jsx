import './Pagination.css';

/**
 * Build a windowed list of page numbers with `null` standing in for an
 * ellipsis: 1 … 4 5 6 … 12
 */
function buildPageWindow(current, total, span = 1) {
  const pages = new Set([1, total]);
  for (let page = current - span; page <= current + span; page += 1) {
    if (page >= 1 && page <= total) pages.add(page);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const output = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) output.push(null);
    output.push(page);
  });
  return output;
}

/**
 * @param {{ page: number, totalPages: number, onPageChange: (page: number) => void }} props
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPageWindow(page, totalPages);
  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <nav className="gp-pagination" aria-label="Pagination">
      <button
        type="button"
        className="gp-pagination__step"
        onClick={() => canGoBack && onPageChange(page - 1)}
        disabled={!canGoBack}
      >
        <i className="bi bi-chevron-left" aria-hidden="true" />
        Previous
      </button>

      <ul className="gp-pagination__pages">
        {pages.map((value, index) =>
          value === null ? (
            <li key={`gap-${index}`} className="gp-pagination__gap" aria-hidden="true">
              &hellip;
            </li>
          ) : (
            <li key={value}>
              <button
                type="button"
                className={
                  value === page
                    ? 'gp-pagination__page is-current'
                    : 'gp-pagination__page'
                }
                onClick={() => onPageChange(value)}
                aria-current={value === page ? 'page' : undefined}
                aria-label={`Page ${value}`}
              >
                {value}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className="gp-pagination__step"
        onClick={() => canGoForward && onPageChange(page + 1)}
        disabled={!canGoForward}
      >
        Next
        <i className="bi bi-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  );
}

import { SORT_OPTIONS } from '../../utils/constants.js';
import { pluralize } from '../../utils/format.js';
import './DirectoryToolbar.css';

/**
 * Result range, sort control and a removable chip for every active filter.
 *
 * @param {{
 *   total?: number,
 *   page?: number,
 *   limit?: number,
 *   sort: string,
 *   onSortChange: (value: string) => void,
 *   activeFilters?: { key: string, value: string, label: string }[],
 *   onRemoveFilter: (key: string, value: string) => void,
 *   onClear: () => void
 * }} props
 */
export default function DirectoryToolbar({
  total = 0,
  page = 1,
  limit = 9,
  sort,
  onSortChange,
  activeFilters = [],
  onRemoveFilter,
  onClear
}) {
  const from = total > 0 ? (page - 1) * limit + 1 : 0;
  const to = total > 0 ? Math.min(page * limit, total) : 0;

  return (
    <div className="gp-toolbar">
      <div className="gp-toolbar__row">
        <p className="gp-toolbar__count" role="status">
          {total > 0 ? (
            <>
              Showing <strong>{from.toLocaleString()}</strong>&ndash;
              <strong>{to.toLocaleString()}</strong> of{' '}
              <strong>{pluralize(total, 'programme')}</strong>
            </>
          ) : (
            'No programmes to show'
          )}
        </p>

        <div className="gp-toolbar__sort">
          <label className="gp-toolbar__sort-label" htmlFor="programme-sort">
            Sort by
          </label>
          <select
            id="programme-sort"
            className="form-select gp-toolbar__select"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="gp-toolbar__chips">
          <span className="gp-toolbar__chips-label">Active filters:</span>
          <ul className="gp-toolbar__chip-list">
            {activeFilters.map((filter) => (
              <li className="gp-chip" key={`${filter.key}:${filter.value}`}>
                <span className="gp-chip__label">{filter.label}</span>
                <button
                  type="button"
                  className="gp-chip__remove"
                  onClick={() => onRemoveFilter(filter.key, filter.value)}
                  aria-label={`Remove filter: ${filter.label}`}
                >
                  <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="gp-btn gp-btn--ghost gp-btn--sm" onClick={onClear}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

import './SearchBar.css';

/**
 * Controlled directory search field. The parent owns the value and does the
 * debouncing; this component only reports the raw string on every change.
 *
 * @param {{ value?: string, onChange: (value: string) => void }} props
 */
export default function SearchBar({ value = '', onChange }) {
  return (
    <div className="gp-searchbar" role="search">
      <label className="gp-sr-only" htmlFor="directory-search">
        Search programmes
      </label>
      <i className="bi bi-search gp-searchbar__icon" aria-hidden="true" />
      <input
        id="directory-search"
        className="gp-searchbar__input"
        type="search"
        value={value}
        placeholder="Search by programme title, department or keyword"
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />

      {value && (
        <button
          type="button"
          className="gp-searchbar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import Pagination from '../components/common/Pagination.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import SearchBar from '../components/directory/SearchBar.jsx';
import FilterSidebar from '../components/directory/FilterSidebar.jsx';
import DirectoryToolbar from '../components/directory/DirectoryToolbar.jsx';
import ProgramGrid from '../components/directory/ProgramGrid.jsx';
import usePrograms from '../hooks/usePrograms.js';
import useDebouncedValue from '../hooks/useDebouncedValue.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { LEVEL_SHORT, MULTI_FILTER_KEYS, PAGE_SIZE } from '../utils/constants.js';
import {
  applyFilterChange,
  buildQueryFromSearchParams,
  readMultiFilters
} from '../utils/format.js';
import './DirectoryPage.css';

/** The real University of Swat admissions portal. */
const ADMISSIONS_URL = 'https://cms1.uswat.edu.pk/admission/program/list/final';

/**
 * Human-readable label for one selected filter value, using the facet option
 * lists the API returns (faculty/department/campus/keyword names and the full
 * degree-type labels). Falls back to the raw value when a facet is not loaded.
 */
function filterLabel(key, value, facets) {
  if (facets) {
    if (key === 'degree') {
      const degree = (facets.degreeTypes || []).find((item) => item.code === value);
      return degree ? degree.label : value;
    }
    if (key === 'faculty') {
      const faculty = (facets.faculties || []).find((item) => item.slug === value);
      return faculty ? faculty.name : value;
    }
    if (key === 'department') {
      const department = (facets.departments || []).find((item) => item.slug === value);
      return department ? department.name : value;
    }
    if (key === 'campus') {
      const campus = (facets.campuses || []).find((item) => item.slug === value);
      return campus ? campus.name : value;
    }
    if (key === 'keyword') {
      const keyword = (facets.keywords || []).find((item) => item.slug === value);
      return keyword ? keyword.name : value;
    }
  }

  if (key === 'level') {
    const short = LEVEL_SHORT[value];
    return short && short !== value ? `${short} · ${value}` : value;
  }

  return value;
}

/**
 * Programme directory at /programs. The complete view state — search text,
 * sort, page and every multi-select filter — lives in the URL query string, so
 * any filtered list is shareable and survives a reload. The header mega-menu
 * links to /programs?faculty=<slug> and the footer links to
 * /programs?campus=<slug>, both of which this page reads out of the URL.
 */
export default function DirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const query = buildQueryFromSearchParams(searchParams);
  const selected = readMultiFilters(searchParams);
  const sort = searchParams.get('sort') || 'relevance';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  useDocumentTitle('Programmes');

  const { programs, meta, facets, loading, error, reload } = usePrograms(query);

  // Push the debounced search text into the URL and reset to the first page.
  useEffect(() => {
    const current = searchParams.get('search') || '';
    if (debouncedSearch === current) return;
    setSearchParams(applyFilterChange(searchParams, 'search', debouncedSearch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the input in step when the URL changes elsewhere (e.g. a faculty link).
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const activeFilters = MULTI_FILTER_KEYS.flatMap((key) =>
    (selected[key] || []).map((value) => ({
      key,
      value,
      label: filterLabel(key, value, facets)
    }))
  );

  const limit = (meta && meta.limit) || PAGE_SIZE;
  const total = (meta && meta.total) || 0;

  function handleToggle(key, value) {
    const current = selected[key] || [];
    const nextValues = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setSearchParams(applyFilterChange(searchParams, key, nextValues));
  }

  function handleSortChange(value) {
    setSearchParams(applyFilterChange(searchParams, 'sort', value));
  }

  function handleClear() {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  }

  function handlePageChange(nextPage) {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete('page');
    else next.set('page', String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="gp-directory">
      <div className="gp-container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Programmes' }]} />

        <header className="gp-directory__head">
          <p className="gp-eyebrow">
            <i className="bi bi-mortarboard" aria-hidden="true" />
            Programme directory
          </p>
          <h1 className="gp-directory__title">Programmes at the University of Swat</h1>
          <p className="gp-lede">
            Search and filter the university&rsquo;s undergraduate, MS/MPhil and doctoral
            programmes by faculty, department, campus and keyword.
          </p>

          <div className="gp-directory__actions">
            <div className="gp-directory__search">
              <SearchBar value={searchInput} onChange={setSearchInput} />
            </div>
            <a
              className="gp-btn gp-btn--red gp-directory__admissions"
              href={ADMISSIONS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Admissions portal
              <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
            </a>
          </div>
        </header>

        <div className="gp-directory__layout">
          <div className="gp-directory__aside">
            <FilterSidebar
              facets={facets}
              selected={selected}
              onToggle={handleToggle}
              onClear={handleClear}
            />
          </div>

          <div className="gp-directory__results">
            <DirectoryToolbar
              total={total}
              page={page}
              limit={limit}
              sort={sort}
              onSortChange={handleSortChange}
              activeFilters={activeFilters}
              onRemoveFilter={handleToggle}
              onClear={handleClear}
            />

            {error ? (
              <ErrorState error={error} onRetry={reload} />
            ) : loading && programs.length === 0 ? (
              <LoadingState message="Loading programmes" />
            ) : (
              <ProgramGrid programs={programs} loading={loading} />
            )}

            {!error && meta && programs.length > 0 && (
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

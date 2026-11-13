import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import Pagination from '../components/common/Pagination.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { useContent } from '../hooks/useSite.js';
import useDebouncedValue from '../hooks/useDebouncedValue.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { CONTENT_PAGE_SIZE, CONTENT_SECTIONS, sectionByKey } from '../utils/constants.js';
import { formatDate, pluralize } from '../utils/format.js';
import './ContentListPage.css';

/**
 * One page behind /news, /announcements, /events, /tenders and /jobs.
 * `q` (search text) and `page` live in the URL so any view can be shared.
 *
 * @param {{ category: 'news'|'announcement'|'event'|'tender'|'job' }} props
 */
export default function ContentListPage({ category }) {
  const section = sectionByKey(category);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(() => searchParams.get('q') || '');
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const q = searchParams.get('q') || '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const sectionLabel = section ? section.label : 'News & Events';
  const lede = section
    ? section.lede
    : 'Institutional news, announcements, events, tenders and job advertisements published by the University of Swat.';

  useDocumentTitle(sectionLabel);

  const { items, meta, counts, loading, error, reload } = useContent({
    category,
    q,
    page,
    limit: CONTENT_PAGE_SIZE
  });

  // Push the debounced search text into the URL and reset to the first page.
  useEffect(() => {
    const current = searchParams.get('q') || '';
    if (debouncedSearch === current) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) next.set('q', debouncedSearch);
    else next.delete('q');
    next.delete('page');
    setSearchParams(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the input in step when the URL changes elsewhere (e.g. switching tabs).
  useEffect(() => {
    setSearchInput(searchParams.get('q') || '');
  }, [searchParams]);

  function handlePageChange(nextPage) {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete('page');
    else next.set('page', String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="gp-content">
      <div className="gp-container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: sectionLabel }]} />

        <header className="gp-content__head">
          {section && (
            <p className="gp-eyebrow">
              <i className={`bi ${section.icon}`} aria-hidden="true" />
              News &amp; announcements
            </p>
          )}
          <h1 className="gp-content__title">{sectionLabel}</h1>
          <p className="gp-lede">{lede}</p>

          <nav className="gp-content__tabs" aria-label="Content sections">
            {CONTENT_SECTIONS.map((tab) => {
              const isActive = tab.key === category;
              return (
                <Link
                  key={tab.key}
                  to={tab.path}
                  className={isActive ? 'gp-content__tab is-active' : 'gp-content__tab'}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <i className={`bi ${tab.icon}`} aria-hidden="true" />
                  <span>{tab.short}</span>
                  {counts && counts[tab.key] != null && (
                    <span className="gp-content__tab-count">{counts[tab.key]}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <form
            className="gp-content__search"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="gp-sr-only" htmlFor="content-search">
              Search {sectionLabel}
            </label>
            <span className="gp-content__search-field">
              <i className="bi bi-search" aria-hidden="true" />
              <input
                id="content-search"
                type="search"
                className="gp-content__search-input"
                placeholder={`Search ${sectionLabel}`}
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </span>
            {searchInput && (
              <button
                type="button"
                className="gp-btn gp-btn--ghost gp-btn--sm"
                onClick={() => setSearchInput('')}
              >
                Clear
              </button>
            )}
          </form>
        </header>

        {loading && <LoadingState message={`Loading ${sectionLabel.toLowerCase()}`} />}
        {!loading && error && <ErrorState error={error} onRetry={reload} />}

        {!loading && !error && meta && (
          <p className="gp-content__summary">
            {pluralize(meta.total, 'item')}
            {q ? ` matching “${q}”` : ''}
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            icon={section ? section.icon : 'bi-newspaper'}
            title="Nothing to show"
            message={`Nothing has been published under ${sectionLabel}${
              q ? ` for “${q}”` : ''
            } on the university website.`}
          />
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="gp-content__list">
            {items.map((item) => (
              <li key={item.id} className="gp-content__item">
                {item.imageUrl && (
                  <span className="gp-content__thumb">
                    <img src={item.imageUrl} alt="" loading="lazy" />
                  </span>
                )}
                <article className="gp-content__body">
                  <p className="gp-content__date">{formatDate(item.publishedDate)}</p>
                  <h2 className="gp-content__item-title">
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  </h2>
                  {item.excerpt && <p className="gp-content__excerpt">{item.excerpt}</p>}
                  <a
                    className="gp-content__source"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read on uswat.edu.pk
                    <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                  </a>
                </article>
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

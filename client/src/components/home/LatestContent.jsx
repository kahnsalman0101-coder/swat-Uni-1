import { Link } from 'react-router-dom';
import LoadingState from '../common/LoadingState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { useContent } from '../../hooks/useSite.js';
import { formatDate } from '../../utils/format.js';
import { sectionByKey } from '../../utils/constants.js';
import './LatestContent.css';

/** The three editorial sections previewed on the home page, in order. */
const PREVIEW_KEYS = ['news', 'announcement', 'event'];

/**
 * One column of the "Latest from the University" strip. Owns its own
 * `useContent` call so no hook is ever invoked inside a map.
 *
 * @param {{ section: object, limit?: number }} props
 */
function ContentColumn({ section, limit = 3 }) {
  const { items, loading, error, reload } = useContent({ category: section.key, limit });

  return (
    <div className="gp-latest__column">
      <header className="gp-latest__column-head">
        <h3 className="gp-latest__column-title">
          <i className={`bi ${section.icon}`} aria-hidden="true" />
          <span>{section.label}</span>
        </h3>
        <Link className="gp-latest__column-link" to={section.path}>
          View all
          <i className="bi bi-arrow-right" aria-hidden="true" />
        </Link>
      </header>

      {loading && <LoadingState message={`Loading ${section.short.toLowerCase()}`} compact />}
      {!loading && error && <ErrorState error={error} onRetry={reload} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={section.icon}
          title="Nothing to show"
          message={`Nothing is published under ${section.label} on the university website.`}
        />
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="gp-latest__list">
          {items.map((item) => (
            <li className="gp-latest__item" key={item.id}>
              <p className="gp-latest__date">{formatDate(item.publishedDate)}</p>
              <a
                className="gp-latest__link"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Three-column preview of the latest News, Announcements and Events, each
 * linking through to its full listing page.
 */
export default function LatestContent() {
  const sections = PREVIEW_KEYS.map(sectionByKey).filter(Boolean);

  return (
    <div className="gp-latest">
      {sections.map((section) => (
        <ContentColumn key={section.key} section={section} />
      ))}
    </div>
  );
}

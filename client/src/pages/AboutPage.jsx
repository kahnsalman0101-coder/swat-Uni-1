import { Link } from 'react-router-dom';

import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { usePage } from '../hooks/useSite.js';
import { useStats } from '../hooks/useProgram.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { toParagraphs } from '../utils/format.js';
import './AboutPage.css';

/** Render a counter value: thousands-separated when numeric, verbatim otherwise. */
function counterValue(value) {
  return typeof value === 'number' ? value.toLocaleString() : String(value);
}

export default function AboutPage() {
  const { page, loading, error, reload } = usePage('about-university');
  const { stats } = useStats();
  useDocumentTitle(page ? page.title : 'About University');

  const paragraphs = page ? toParagraphs(page.body) : [];
  const counters = (stats && stats.counters) || [];

  return (
    <div className="gp-about">
      <div className="gp-container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About University' }]} />

        {loading && <LoadingState message="Loading about the university" />}

        {!loading && error && <ErrorState error={error} onRetry={reload} />}

        {!loading && !error && !page && (
          <EmptyState
            icon="bi-bank"
            title="Page not available"
            message="The About University page could not be found."
          />
        )}

        {!loading && !error && page && (
          <article className="gp-about__article">
            <header className="gp-about__head">
              <p className="gp-eyebrow">About the university</p>
              <h1 className="gp-about__title">{page.title}</h1>
              {page.subtitle && <p className="gp-about__standfirst">{page.subtitle}</p>}
            </header>

            {counters.length > 0 && (
              <section className="gp-about__stats" aria-label="The university at a glance">
                {counters.map((counter) => (
                  <div className="gp-about__stat" key={counter.key}>
                    <span className="gp-about__stat-value">{counterValue(counter.value)}</span>
                    <span className="gp-about__stat-label">{counter.label}</span>
                  </div>
                ))}
              </section>
            )}

            {paragraphs.length > 0 && (
              <div className="gp-about__prose">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            <nav className="gp-about__links" aria-label="Related pages">
              <Link className="gp-btn gp-btn--red" to="/programs">
                Browse the programme directory
              </Link>
              <Link className="gp-btn gp-btn--green" to="/faculties">
                Faculties &amp; departments
              </Link>
              <Link className="gp-btn gp-btn--green" to="/campuses">
                Campuses
              </Link>
              <Link className="gp-btn gp-btn--green" to="/vice-chancellor">
                Vice Chancellor&rsquo;s message
              </Link>
            </nav>

            {page.sourceUrl && (
              <footer className="gp-about__foot">
                <a
                  className="gp-btn gp-btn--ghost gp-btn--sm"
                  href={page.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read this page on uswat.edu.pk
                  <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                </a>
              </footer>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

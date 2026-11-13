import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { usePage } from '../hooks/useSite.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { toParagraphs } from '../utils/format.js';
import './ViceChancellorPage.css';

export default function ViceChancellorPage() {
  const { page, loading, error, reload } = usePage('vice-chancellors-message');
  useDocumentTitle(page ? page.title : "Vice Chancellor's Message");

  const paragraphs = page ? toParagraphs(page.body) : [];

  return (
    <div className="gp-vc">
      <div className="gp-container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: "Vice Chancellor's Message" }]} />

        {loading && <LoadingState message="Loading the Vice Chancellor's message" />}

        {!loading && error && <ErrorState error={error} onRetry={reload} />}

        {!loading && !error && !page && (
          <EmptyState
            icon="bi-person-badge"
            title="Message not available"
            message="The Vice Chancellor's message could not be found."
          />
        )}

        {!loading && !error && page && (
          <article className="gp-vc__article">
            <header className="gp-vc__head">
              <p className="gp-eyebrow">Leadership</p>
              <h1 className="gp-vc__title">{page.title}</h1>
              {page.subtitle && <p className="gp-vc__standfirst">{page.subtitle}</p>}
            </header>

            {paragraphs.length > 0 && (
              <div className="gp-vc__prose">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {page.sourceUrl && (
              <footer className="gp-vc__foot">
                <a
                  className="gp-btn gp-btn--green gp-btn--sm"
                  href={page.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read this message on uswat.edu.pk
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

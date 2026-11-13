import { Link } from 'react-router-dom';

import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { useCampuses } from '../hooks/useSite.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { pluralize } from '../utils/format.js';
import './CampusesPage.css';

export default function CampusesPage() {
  useDocumentTitle('Campuses');
  const { campuses, loading, error, reload } = useCampuses();

  return (
    <div className="gp-campuses">
      <div className="gp-container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Campuses' }]} />

        <header className="gp-campuses__head">
          <p className="gp-eyebrow">Where we are</p>
          <h1 className="gp-campuses__title">Campuses</h1>
          <p className="gp-lede">The campuses of the University of Swat.</p>
        </header>

        {loading && <LoadingState message="Loading campuses" />}
        {!loading && error && <ErrorState error={error} onRetry={reload} />}

        {!loading && !error && campuses.length === 0 && (
          <EmptyState
            icon="bi-geo-alt"
            title="No campuses listed"
            message="The campus list could not be found."
          />
        )}

        {!loading && !error && campuses.length > 0 && (
          <div className="gp-campuses__grid">
            {campuses.map((campus) => (
              <article key={campus.id} className="gp-campus">
                <h2 className="gp-campus__name">{campus.name}</h2>

                {campus.location && (
                  <p className="gp-campus__location">
                    <i className="bi bi-geo-alt" aria-hidden="true" />
                    {campus.location}
                  </p>
                )}

                {campus.overview && <p className="gp-campus__overview">{campus.overview}</p>}

                {(typeof campus.departmentCount === 'number' ||
                  typeof campus.programCount === 'number') && (
                  <ul className="gp-campus__stats">
                    {typeof campus.departmentCount === 'number' && (
                      <li>{pluralize(campus.departmentCount, 'department')}</li>
                    )}
                    {typeof campus.programCount === 'number' && (
                      <li>{pluralize(campus.programCount, 'programme')}</li>
                    )}
                  </ul>
                )}

                <div className="gp-campus__actions">
                  <Link
                    className="gp-btn gp-btn--green gp-btn--sm"
                    to={`/programs?campus=${encodeURIComponent(campus.slug)}`}
                  >
                    Browse programmes
                  </Link>
                  {campus.url && (
                    <a
                      className="gp-campus__external"
                      href={campus.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Campus page on uswat.edu.pk
                      <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Link, useParams } from 'react-router-dom';

import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import DegreeBadge from '../components/common/DegreeBadge.jsx';
import KeywordPills from '../components/common/KeywordPills.jsx';
import ProgramGrid from '../components/directory/ProgramGrid.jsx';
import useProgram from '../hooks/useProgram.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { toParagraphs } from '../utils/format.js';
import './ProgramDetailPage.css';

/** The real University of Swat admissions portal. */
const ADMISSIONS_URL = 'https://cms1.uswat.edu.pk/admission/program/list/final';

/**
 * Renders an organisation name as an external link when the API publishes a
 * url for it, and as plain text otherwise.
 */
function OrgLink({ name, url }) {
  if (!name) return null;
  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {name}
      </a>
    );
  }
  return <span>{name}</span>;
}

/**
 * Programme detail at /programs/:slug. Renders only what the API returns:
 * every optional element (description, duration, admission note, keywords,
 * related programmes) is omitted when the record does not carry it.
 */
export default function ProgramDetailPage() {
  const { slug } = useParams();
  const { program, loading, error, reload } = useProgram(slug);

  useDocumentTitle(program ? program.title : 'Programme');

  if (loading) {
    return (
      <div className="gp-detail">
        <div className="gp-container">
          <LoadingState message="Loading programme" />
        </div>
      </div>
    );
  }

  if (error || !program) {
    const notFound = !error || error.status === 404;

    return (
      <div className="gp-detail">
        <div className="gp-container">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Programmes', to: '/programs' },
              { label: notFound ? 'Programme not found' : 'Error' }
            ]}
          />

          {notFound ? (
            <EmptyState
              icon="bi-mortarboard"
              title="Programme not found"
              message="We could not find that programme in the University of Swat directory."
            >
              <Link className="gp-btn gp-btn--red gp-btn--sm" to="/programs">
                Back to the programme directory
              </Link>
            </EmptyState>
          ) : (
            <ErrorState error={error} onRetry={reload} />
          )}
        </div>
      </div>
    );
  }

  const descriptionParagraphs = toParagraphs(program.description);

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Programmes', to: '/programs' }
  ];
  if (program.facultySlug) {
    breadcrumbItems.push({
      label: program.faculty,
      to: `/programs?faculty=${encodeURIComponent(program.facultySlug)}`
    });
  }
  breadcrumbItems.push({ label: program.title });

  return (
    <article className="gp-detail">
      <div className="gp-container">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="gp-detail__head">
          <div className="gp-detail__badges">
            <DegreeBadge
              degreeType={program.degreeType}
              badgeKey={program.badgeKey}
              label={program.degreeTypeLabel}
            />
            {program.level && <span className="gp-detail__level">{program.level}</span>}
          </div>

          <h1 className="gp-detail__title">{program.title}</h1>

          <ul className="gp-detail__org">
            {program.department && (
              <li className="gp-detail__org-item">
                <i className="bi bi-diagram-3" aria-hidden="true" />
                <OrgLink name={program.department} url={program.departmentUrl} />
              </li>
            )}
            {program.faculty && (
              <li className="gp-detail__org-item">
                <i className="bi bi-building" aria-hidden="true" />
                <OrgLink name={program.faculty} url={program.facultyUrl} />
              </li>
            )}
            {program.campus && (
              <li className="gp-detail__org-item">
                <i className="bi bi-geo-alt" aria-hidden="true" />
                <OrgLink name={program.campus} url={program.campusUrl} />
                {program.campusLocation && (
                  <span className="gp-detail__org-note">{program.campusLocation}</span>
                )}
              </li>
            )}
          </ul>

          {program.overview && <p className="gp-detail__overview">{program.overview}</p>}
        </header>

        <div className="gp-detail__body">
          <div className="gp-detail__main">
            {descriptionParagraphs.length > 0 && (
              <section className="gp-detail__section" aria-labelledby="programme-about">
                <h2 id="programme-about" className="gp-detail__section-title">
                  About this programme
                </h2>
                <div className="gp-detail__prose">
                  {descriptionParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            {program.admissionNote && (
              <aside className="gp-detail__notice" aria-label="Admission note">
                <i className="bi bi-info-circle" aria-hidden="true" />
                <p>{program.admissionNote}</p>
              </aside>
            )}

            {(program.departmentSlug || program.facultySlug) && (
              <p className="gp-detail__browse">
                Browse more programmes from{' '}
                {program.departmentSlug && (
                  <Link
                    to={`/programs?department=${encodeURIComponent(program.departmentSlug)}`}
                  >
                    {program.department}
                  </Link>
                )}
                {program.departmentSlug && program.facultySlug && ' or '}
                {program.facultySlug && (
                  <Link to={`/programs?faculty=${encodeURIComponent(program.facultySlug)}`}>
                    {program.faculty}
                  </Link>
                )}
                .
              </p>
            )}
          </div>

          <aside className="gp-detail__side" aria-label="Programme facts">
            <dl className="gp-detail__facts">
              {program.level && (
                <div className="gp-detail__fact">
                  <dt>Study level</dt>
                  <dd>{program.level}</dd>
                </div>
              )}
              {program.degreeTypeLabel && (
                <div className="gp-detail__fact">
                  <dt>Degree type</dt>
                  <dd>
                    {program.degreeTypeLabel}
                    {program.degreeType && ` (${program.degreeType})`}
                  </dd>
                </div>
              )}
              {program.department && (
                <div className="gp-detail__fact">
                  <dt>Department</dt>
                  <dd>
                    <OrgLink name={program.department} url={program.departmentUrl} />
                  </dd>
                </div>
              )}
              {program.faculty && (
                <div className="gp-detail__fact">
                  <dt>Faculty</dt>
                  <dd>
                    <OrgLink name={program.faculty} url={program.facultyUrl} />
                  </dd>
                </div>
              )}
              {program.campus && (
                <div className="gp-detail__fact">
                  <dt>Campus</dt>
                  <dd>
                    <OrgLink name={program.campus} url={program.campusUrl} />
                  </dd>
                </div>
              )}
              {program.duration && (
                <div className="gp-detail__fact">
                  <dt>Duration</dt>
                  <dd>{program.duration}</dd>
                </div>
              )}
            </dl>

            {program.keywords && program.keywords.length > 0 && (
              <div className="gp-detail__keywords">
                <h2 className="gp-detail__side-title">Keywords</h2>
                <KeywordPills keywords={program.keywords} linked />
              </div>
            )}

            {program.sourceUrl && (
              <a
                className="gp-detail__source"
                href={program.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Source: uswat.edu.pk
                <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
              </a>
            )}

            <a
              className="gp-btn gp-btn--red gp-btn--block gp-detail__cta"
              href={ADMISSIONS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Apply via the admissions portal
              <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
            </a>
          </aside>
        </div>

        {program.related && program.related.length > 0 && (
          <section className="gp-detail__related" aria-labelledby="related-programmes">
            <h2 id="related-programmes" className="gp-detail__section-title">
              Related programmes
            </h2>
            <ProgramGrid programs={program.related} />
          </section>
        )}
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';

import Hero from '../components/home/Hero.jsx';
import StatsBand from '../components/home/StatsBand.jsx';
import DegreeExplorer from '../components/home/DegreeExplorer.jsx';
import FeaturedPrograms from '../components/home/FeaturedPrograms.jsx';
import LatestContent from '../components/home/LatestContent.jsx';
import CtaBand from '../components/home/CtaBand.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { useFilterOptions, useStats } from '../hooks/useProgram.js';
import { usePrograms } from '../hooks/usePrograms.js';
import { usePage } from '../hooks/useSite.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { toParagraphs } from '../utils/format.js';
import './HomePage.css';

/**
 * University of Swat home page: hero, the published counters, the degree
 * explorer, featured programmes, the Vice Chancellor's message, an About the
 * University excerpt, the latest news/announcements/events and a closing call
 * to action.
 */
export default function HomePage() {
  useDocumentTitle('University of Swat');

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    reload: reloadStats
  } = useStats();

  const {
    filters,
    loading: filtersLoading,
    error: filtersError,
    reload: reloadFilters
  } = useFilterOptions();

  const {
    programs,
    loading: programsLoading,
    error: programsError,
    reload: reloadPrograms
  } = usePrograms({ sort: 'title', limit: 6, page: 1 });

  const {
    page: vcPage,
    loading: vcLoading,
    error: vcError,
    reload: reloadVc
  } = usePage('vice-chancellors-message');

  const {
    page: aboutPage,
    loading: aboutLoading,
    error: aboutError,
    reload: reloadAbout
  } = usePage('about-university');

  const aboutParagraphs = aboutPage ? toParagraphs(aboutPage.body) : [];
  const heroLede = aboutParagraphs[0] || '';
  const aboutExcerpt = aboutParagraphs[1] || aboutParagraphs[0] || '';

  const vcParagraphs = vcPage ? toParagraphs(vcPage.body) : [];
  const vcExcerpt = vcParagraphs[0] || '';

  const degreeTypeCount =
    filters && Array.isArray(filters.degreeTypes) ? filters.degreeTypes.length : null;
  const facultyCount = stats && stats.totals ? stats.totals.faculties : null;

  const degreeLede =
    degreeTypeCount && facultyCount
      ? `${degreeTypeCount} degree types are offered across ${facultyCount} faculties. Choose a degree type to open the programme directory filtered on it.`
      : 'Choose a degree type to open the programme directory filtered on it.';

  return (
    <div className="gp-home">
      <Hero lede={heroLede} />

      <StatsBand
        stats={stats}
        loading={statsLoading}
        error={statsError}
        onRetry={reloadStats}
      />

      <section className="gp-section">
        <div className="gp-container">
          <SectionHeading
            eyebrow="Explore by degree type"
            title="Find a programme by the degree you want"
            lede={degreeLede}
          />
          <DegreeExplorer
            degreeTypes={filters ? filters.degreeTypes : []}
            loading={filtersLoading}
          />
          {!filtersLoading && filtersError && (
            <ErrorState error={filtersError} onRetry={reloadFilters} />
          )}
        </div>
      </section>

      <section className="gp-section gp-section--paper">
        <div className="gp-container">
          <SectionHeading
            eyebrow="Programme directory"
            title="Featured programmes"
            lede="A selection of the degrees the University of Swat currently offers, taken from the programme directory."
          />
          <FeaturedPrograms
            programs={programs}
            loading={programsLoading}
            error={programsError}
            onRetry={reloadPrograms}
          />
        </div>
      </section>

      <section className="gp-section gp-section--tinted">
        <div className="gp-container gp-home__page">
          <SectionHeading
            eyebrow="From the Vice Chancellor"
            title={vcPage ? vcPage.title : "Vice Chancellor's Message"}
          />
          {vcLoading && <LoadingState message="Loading the Vice Chancellor's message" />}
          {!vcLoading && vcError && <ErrorState error={vcError} onRetry={reloadVc} />}
          {!vcLoading && !vcError && vcExcerpt && (
            <div className="gp-home__page-body">
              <p className="gp-home__page-text">{vcExcerpt}</p>
              {vcPage.subtitle && (
                <p className="gp-home__attribution">{vcPage.subtitle}</p>
              )}
              <div className="gp-home__page-actions">
                <Link className="gp-btn gp-btn--green" to="/vice-chancellor">
                  Read more
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
                {vcPage.sourceUrl && (
                  <a
                    className="gp-home__source"
                    href={vcPage.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source: uswat.edu.pk
                    <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="gp-section gp-section--paper">
        <div className="gp-container gp-home__page">
          <SectionHeading
            eyebrow="About the University"
            title={aboutPage ? aboutPage.title : 'About University'}
          />
          {aboutLoading && <LoadingState message="Loading the University profile" />}
          {!aboutLoading && aboutError && <ErrorState error={aboutError} onRetry={reloadAbout} />}
          {!aboutLoading && !aboutError && aboutExcerpt && (
            <div className="gp-home__page-body">
              <p className="gp-home__page-text">{aboutExcerpt}</p>
              <div className="gp-home__page-actions">
                <Link className="gp-btn gp-btn--green" to="/about">
                  Read more
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
                {aboutPage.sourceUrl && (
                  <a
                    className="gp-home__source"
                    href={aboutPage.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source: uswat.edu.pk
                    <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="gp-section gp-section--tinted">
        <div className="gp-container">
          <SectionHeading
            eyebrow="Latest from the University"
            title="News, announcements and events"
            lede="The most recent items the University publishes under each section."
          />
          <LatestContent />
        </div>
      </section>

      <CtaBand />
    </div>
  );
}

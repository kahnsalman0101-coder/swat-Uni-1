import { Link } from 'react-router-dom';

import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { useFaculties } from '../hooks/useSite.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { pluralize } from '../utils/format.js';
import './FacultiesPage.css';

export default function FacultiesPage() {
  useDocumentTitle('Faculties and Departments');
  const { faculties, loading, error, reload } = useFaculties();

  const facultyCount = faculties.length;
  const departmentCount = faculties.reduce(
    (total, faculty) => total + ((faculty.departments && faculty.departments.length) || 0),
    0
  );

  return (
    <div className="gp-faculties">
      <div className="gp-container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Faculties' }]} />

        <header className="gp-faculties__head">
          <p className="gp-eyebrow">Academic structure</p>
          <h1 className="gp-faculties__title">Faculties and Departments</h1>
          <p className="gp-lede">
            {facultyCount > 0
              ? `${pluralize(facultyCount, 'faculty', 'faculties')} and ${pluralize(
                  departmentCount,
                  'department'
                )}, each grouped with the departments that sit within it.`
              : 'The faculties of the University of Swat and the departments that sit within each one.'}
          </p>
        </header>

        {loading && <LoadingState message="Loading faculties" />}
        {!loading && error && <ErrorState error={error} onRetry={reload} />}

        {!loading && !error && faculties.length === 0 && (
          <EmptyState
            icon="bi-diagram-3"
            title="No faculties listed"
            message="The faculties directory could not be found."
          />
        )}

        {!loading && !error && faculties.length > 0 && (
          <div className="gp-faculties__list">
            {faculties.map((faculty) => (
              <section
                key={faculty.id}
                className="gp-faculty"
                aria-labelledby={`faculty-${faculty.id}`}
              >
                <header className="gp-faculty__head">
                  <h2 id={`faculty-${faculty.id}`} className="gp-faculty__name">
                    {faculty.name}
                  </h2>
                  <p className="gp-faculty__meta">
                    {faculty.shortName && (
                      <span className="gp-faculty__short">{faculty.shortName}</span>
                    )}
                    {typeof faculty.programCount === 'number' && (
                      <span>{pluralize(faculty.programCount, 'programme')}</span>
                    )}
                  </p>
                  <Link
                    className="gp-btn gp-btn--green gp-btn--sm"
                    to={`/programs?faculty=${encodeURIComponent(faculty.slug)}`}
                  >
                    Browse programmes
                  </Link>
                </header>

                {faculty.departments && faculty.departments.length > 0 ? (
                  <ul className="gp-faculty__departments">
                    {faculty.departments.map((department) => (
                      <li key={department.id} className="gp-department">
                        <div className="gp-department__text">
                          <h3 className="gp-department__name">{department.name}</h3>
                          <p className="gp-department__meta">
                            {department.campus && (
                              <span className="gp-department__campus">
                                <i className="bi bi-geo-alt" aria-hidden="true" />
                                {department.campus}
                              </span>
                            )}
                            <span>
                              {typeof department.programCount === 'number' && department.programCount > 0
                                ? pluralize(department.programCount, 'programme')
                                : 'No programmes listed'}
                            </span>
                          </p>
                        </div>
                        <div className="gp-department__actions">
                          <Link to={`/programs?department=${encodeURIComponent(department.slug)}`}>
                            View programmes
                          </Link>
                          {department.url && (
                            <a href={department.url} target="_blank" rel="noreferrer">
                              Department page on uswat.edu.pk
                              <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="gp-faculty__empty">No departments are listed for this faculty.</p>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

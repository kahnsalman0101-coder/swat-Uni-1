import { Link } from 'react-router-dom';
import DegreeBadge from '../common/DegreeBadge.jsx';
import LoadingState from '../common/LoadingState.jsx';
import './DegreeExplorer.css';

/**
 * "Browse by degree" grid. Each card links into the directory pre-filtered on
 * that degree type.
 *
 * @param {{ degreeTypes?: object[], loading?: boolean }} props
 */
export default function DegreeExplorer({ degreeTypes = [], loading = false }) {
  if (loading) return <LoadingState message="Loading degree types" compact />;
  if (!degreeTypes.length) return null;

  return (
    <ul className="gp-degree-grid">
      {degreeTypes.map((degree) => (
        <li key={degree.code}>
          <Link
            className="gp-degree-card"
            to={`/programs?degree=${encodeURIComponent(degree.code)}`}
          >
            <DegreeBadge
              degreeType={degree.code}
              badgeKey={degree.badgeKey}
              label={degree.label}
            />
            <span className="gp-degree-card__label">{degree.label}</span>
            <span className="gp-degree-card__count">
              {degree.count} {degree.count === 1 ? 'program' : 'programs'}
            </span>
            <i className="bi bi-arrow-right gp-degree-card__arrow" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

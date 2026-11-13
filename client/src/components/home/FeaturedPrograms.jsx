import { Link } from 'react-router-dom';
import ProgramCard from '../directory/ProgramCard.jsx';
import { ProgramGridSkeleton } from '../common/LoadingState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import './FeaturedPrograms.css';

/**
 * Home page highlight reel: six programmes rendered through the shared
 * directory card, linking into the full programme directory.
 *
 * @param {{ programs?: object[], loading?: boolean, error?: Error|null, onRetry?: () => void }} props
 */
export default function FeaturedPrograms({
  programs = [],
  loading = false,
  error = null,
  onRetry = null
}) {
  if (loading) return <ProgramGridSkeleton count={6} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!programs.length) return null;

  return (
    <div className="gp-featured">
      <ul className="gp-featured__grid">
        {programs.map((program) => (
          <li key={program.slug}>
            <ProgramCard program={program} />
          </li>
        ))}
      </ul>

      <div className="gp-featured__footer">
        <Link className="gp-btn gp-btn--green" to="/programs">
          Browse the programme directory
          <i className="bi bi-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

import ProgramCard from './ProgramCard.jsx';
import { ProgramGridSkeleton } from '../common/LoadingState.jsx';
import EmptyState from '../common/EmptyState.jsx';
import './ProgramGrid.css';

/**
 * The directory result set plus its loading and empty states.
 *
 * @param {{ programs?: object[], loading?: boolean }} props
 */
export default function ProgramGrid({ programs = [], loading = false }) {
  if (loading && programs.length === 0) {
    return <ProgramGridSkeleton count={9} />;
  }

  if (!programs.length) {
    return (
      <EmptyState
        icon="bi-search"
        title="No programmes found"
        message="Try removing a filter or searching for a different keyword."
      />
    );
  }

  return (
    <ul className="gp-program-grid" aria-busy={loading}>
      {programs.map((program) => (
        <li className="gp-program-grid__item" key={program.slug}>
          <ProgramCard program={program} />
        </li>
      ))}
    </ul>
  );
}

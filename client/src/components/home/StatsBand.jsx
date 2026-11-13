import LoadingState from '../common/LoadingState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import './StatsBand.css';

/**
 * Green-tinted band of the six counters the University publishes. Every number
 * comes straight from `/api/stats` — nothing is hard-coded.
 *
 * @param {{ stats?: object|null, loading?: boolean, error?: Error|null, onRetry?: () => void }} props
 */
export default function StatsBand({ stats = null, loading = false, error = null, onRetry = null }) {
  const counters = (stats && stats.counters) || [];

  if (!loading && !error && counters.length === 0) return null;

  return (
    <section className="gp-stats" aria-label="University of Swat at a glance">
      <div className="gp-container">
        {loading && <LoadingState message="Loading university figures" compact />}

        {!loading && error && <ErrorState error={error} onRetry={onRetry} />}

        {!loading && !error && counters.length > 0 && (
          <ul className="gp-stats__list">
            {counters.map((counter) => (
              <li className="gp-stats__item" key={counter.key}>
                <p className="gp-stats__value">{counter.value.toLocaleString()}</p>
                <p className="gp-stats__label">{counter.label}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

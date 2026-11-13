import './LoadingState.css';

/**
 * Inline spinner with an accessible status message.
 *
 * @param {{ message?: string, compact?: boolean }} props
 */
export default function LoadingState({ message = 'Loading programs', compact = false }) {
  return (
    <div
      className={compact ? 'gp-loading gp-loading--compact' : 'gp-loading'}
      role="status"
      aria-live="polite"
    >
      <span className="gp-loading__spinner" aria-hidden="true" />
      <p className="gp-loading__message">{message}&hellip;</p>
    </div>
  );
}

/**
 * Placeholder card shown while the first page of results is in flight, so the
 * grid does not collapse and shift the layout.
 */
export function ProgramCardSkeleton() {
  return (
    <div className="gp-skeleton-card" aria-hidden="true">
      <div className="gp-skeleton-card__row">
        <span className="gp-skeleton gp-skeleton--badge" />
        <span className="gp-skeleton gp-skeleton--pill" />
      </div>
      <span className="gp-skeleton gp-skeleton--title" />
      <span className="gp-skeleton gp-skeleton--line" />
      <span className="gp-skeleton gp-skeleton--line gp-skeleton--short" />
      <div className="gp-skeleton-card__row">
        <span className="gp-skeleton gp-skeleton--pill" />
        <span className="gp-skeleton gp-skeleton--pill" />
        <span className="gp-skeleton gp-skeleton--pill" />
      </div>
    </div>
  );
}

/**
 * @param {{ count?: number }} props
 */
export function ProgramGridSkeleton({ count = 9 }) {
  return (
    <div className="gp-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ProgramCardSkeleton key={index} />
      ))}
    </div>
  );
}

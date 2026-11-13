import './ErrorState.css';

/**
 * @param {{ error?: Error|null, title?: string, onRetry?: () => void }} props
 */
export default function ErrorState({
  error = null,
  title = 'Something went wrong',
  onRetry = null
}) {
  return (
    <div className="gp-error" role="alert">
      <span className="gp-error__icon" aria-hidden="true">
        <i className="bi bi-exclamation-triangle-fill" />
      </span>
      <h3 className="gp-error__title">{title}</h3>
      <p className="gp-error__message">
        {error && error.message
          ? error.message
          : 'The programs service could not be reached. Please try again.'}
      </p>
      {onRetry && (
        <button type="button" className="gp-btn gp-btn--red gp-btn--sm" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

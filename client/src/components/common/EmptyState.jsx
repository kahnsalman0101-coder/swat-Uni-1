import './EmptyState.css';

/**
 * @param {{ icon?: string, title?: string, message?: string, children?: import('react').ReactNode }} props
 */
export default function EmptyState({
  icon = 'bi-search',
  title = 'No programs found',
  message = 'Try removing a filter or searching for a different keyword.',
  children = null
}) {
  return (
    <div className="gp-empty" role="status">
      <span className="gp-empty__icon" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </span>
      <h3 className="gp-empty__title">{title}</h3>
      <p className="gp-empty__message">{message}</p>
      {children && <div className="gp-empty__actions">{children}</div>}
    </div>
  );
}

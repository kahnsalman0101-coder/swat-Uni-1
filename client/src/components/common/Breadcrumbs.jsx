import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

/**
 * @param {{ items: { label: string, to?: string }[] }} props Last item is
 * rendered as the current page and is never a link.
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="gp-breadcrumbs">
      <ol className="gp-breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="gp-breadcrumbs__item">
              {isLast || !item.to ? (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
              {!isLast && (
                <i className="bi bi-chevron-right gp-breadcrumbs__sep" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

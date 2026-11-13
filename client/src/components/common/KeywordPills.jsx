import { Link } from 'react-router-dom';
import './KeywordPills.css';

/**
 * Renders keyword tags. Accepts either an array of strings (list responses)
 * or an array of { name, slug } objects (detail responses).
 *
 * @param {{ keywords?: (string|{name: string, slug?: string})[], max?: number, linked?: boolean }} props
 */
export default function KeywordPills({ keywords = [], max = 0, linked = false }) {
  if (!keywords.length) return null;

  const visible = max > 0 ? keywords.slice(0, max) : keywords;
  const hiddenCount = keywords.length - visible.length;

  return (
    <ul className="gp-pills" aria-label="Program keywords">
      {visible.map((keyword) => {
        const name = typeof keyword === 'string' ? keyword : keyword.name;
        const slug = typeof keyword === 'string' ? null : keyword.slug;

        return (
          <li key={name}>
            {linked && slug ? (
              <Link className="gp-pill gp-pill--link" to={`/programs?keyword=${encodeURIComponent(slug)}`}>
                {name}
              </Link>
            ) : (
              <span className="gp-pill">{name}</span>
            )}
          </li>
        );
      })}
      {hiddenCount > 0 && (
        <li>
          <span className="gp-pill gp-pill--more">+{hiddenCount} more</span>
        </li>
      )}
    </ul>
  );
}

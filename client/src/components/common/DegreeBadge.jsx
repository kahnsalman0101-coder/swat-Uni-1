import { badgeClass } from '../../utils/format.js';
import './DegreeBadge.css';

/**
 * Degree badge. The colour is driven entirely by the `badgeKey` the API
 * returns for the degree type, mapped to a modifier class in DegreeBadge.css.
 *
 * @param {{ degreeType: string, badgeKey?: string, label?: string, size?: 'sm'|'md'|'lg' }} props
 */
export default function DegreeBadge({ degreeType, badgeKey, label, size = 'md' }) {
  return (
    <span
      className={`gp-badge gp-badge--${size} ${badgeClass(badgeKey)}`}
      title={label || degreeType}
    >
      {degreeType}
    </span>
  );
}

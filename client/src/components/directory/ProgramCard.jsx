import { Link } from 'react-router-dom';
import DegreeBadge from '../common/DegreeBadge.jsx';
import KeywordPills from '../common/KeywordPills.jsx';
import { LEVEL_SHORT } from '../../utils/constants.js';
import './ProgramCard.css';

/**
 * Directory result card for one programme: degree badge, study level, title,
 * the department / faculty / campus we actually hold, the overview, keywords
 * and the duration when the API publishes one.
 *
 * @param {{ program: object }} props
 */
export default function ProgramCard({ program }) {
  const levelLabel = LEVEL_SHORT[program.level] || program.level;

  return (
    <article className="gp-program-card">
      <header className="gp-program-card__top">
        <DegreeBadge
          degreeType={program.degreeType}
          badgeKey={program.badgeKey}
          label={program.degreeTypeLabel}
        />
        {levelLabel && <span className="gp-program-card__level">{levelLabel}</span>}
      </header>

      <h3 className="gp-program-card__title">
        <Link to={`/programs/${program.slug}`}>{program.title}</Link>
      </h3>

      <ul className="gp-program-card__org">
        {program.department && (
          <li className="gp-program-card__org-item">
            <i className="bi bi-diagram-3" aria-hidden="true" />
            <span>{program.department}</span>
          </li>
        )}
        {program.faculty && (
          <li className="gp-program-card__org-item">
            <i className="bi bi-building" aria-hidden="true" />
            <span>{program.faculty}</span>
          </li>
        )}
        {program.campus && (
          <li className="gp-program-card__org-item">
            <i className="bi bi-geo-alt" aria-hidden="true" />
            <span>{program.campus}</span>
          </li>
        )}
      </ul>

      {program.overview && <p className="gp-program-card__overview">{program.overview}</p>}

      <KeywordPills keywords={program.keywords} max={4} />

      {program.duration && (
        <dl className="gp-program-card__meta">
          <div className="gp-program-card__meta-item">
            <dt>Duration</dt>
            <dd>{program.duration}</dd>
          </div>
        </dl>
      )}

      <footer className="gp-program-card__footer">
        <Link className="gp-btn gp-btn--red gp-btn--sm" to={`/programs/${program.slug}`}>
          View programme
          <i className="bi bi-arrow-right" aria-hidden="true" />
        </Link>
      </footer>
    </article>
  );
}

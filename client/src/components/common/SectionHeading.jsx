import './SectionHeading.css';

/**
 * Consistent section header: red eyebrow rule, serif title, muted lede and an
 * optional trailing action (rendered to the right on wide screens).
 *
 * @param {{ eyebrow?: string, title: string, lede?: string, level?: 1|2|3, align?: 'start'|'center', action?: import('react').ReactNode }} props
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  level = 2,
  align = 'start',
  action = null
}) {
  const Heading = `h${level}`;

  return (
    <div className={`gp-section-heading gp-section-heading--${align}`}>
      <div className="gp-section-heading__text">
        {eyebrow && <p className="gp-eyebrow">{eyebrow}</p>}
        <Heading className="gp-section-heading__title">{title}</Heading>
        {lede && <p className="gp-section-heading__lede gp-lede">{lede}</p>}
      </div>
      {action && <div className="gp-section-heading__action">{action}</div>}
    </div>
  );
}

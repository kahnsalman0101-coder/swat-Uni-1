import DegreeBadge from '../common/DegreeBadge.jsx';
import { LEVEL_SHORT } from '../../utils/constants.js';
import './FilterSidebar.css';

/** Canonical order of the three study levels. */
const LEVEL_ORDER = Object.keys(LEVEL_SHORT);

/** One checkbox row shared by every facet group. */
function FilterOption({ id, label, count, badge = null, checked, onChange }) {
  return (
    <div className="gp-filter-option">
      <input
        className="form-check-input gp-filter-option__box"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label className="gp-filter-option__label" htmlFor={id}>
        {badge ? (
          <DegreeBadge
            degreeType={badge.code}
            badgeKey={badge.badgeKey}
            label={badge.label}
            size="sm"
          />
        ) : null}
        <span className="gp-filter-option__text">{label}</span>
        {typeof count === 'number' && (
          <span className="gp-filter-option__count">{count}</span>
        )}
      </label>
    </div>
  );
}

/**
 * Facet panel for the directory. Groups are rendered in the order the
 * university lists them: Level, Degree type, Faculty, Department, Campus,
 * Keywords. A group whose facet array is empty is skipped entirely.
 *
 * @param {{
 *   facets?: object|null,
 *   selected: { degree: string[], level: string[], faculty: string[], department: string[], campus: string[], keyword: string[] },
 *   onToggle: (key: string, value: string) => void,
 *   onClear: () => void
 * }} props
 */
export default function FilterSidebar({ facets = null, selected, onToggle, onClear }) {
  const chosen = {
    degree: selected.degree || [],
    level: selected.level || [],
    faculty: selected.faculty || [],
    department: selected.department || [],
    campus: selected.campus || [],
    keyword: selected.keyword || []
  };

  const levels = (facets && facets.levels) || [];
  const degreeTypes = (facets && facets.degreeTypes) || [];
  const faculties = (facets && facets.faculties) || [];
  const departments = (facets && facets.departments) || [];
  const campuses = (facets && facets.campuses) || [];
  const keywords = (facets && facets.keywords) || [];

  const activeCount = Object.values(chosen).reduce((total, values) => total + values.length, 0);

  const orderedLevels = [...levels].sort((a, b) => {
    const indexA = LEVEL_ORDER.indexOf(a.value);
    const indexB = LEVEL_ORDER.indexOf(b.value);
    return (indexA === -1 ? LEVEL_ORDER.length : indexA) -
      (indexB === -1 ? LEVEL_ORDER.length : indexB);
  });

  return (
    <aside className="gp-sidebar" aria-label="Filter programmes">
      <div className="gp-sidebar__head">
        <h2 className="gp-sidebar__title">
          Refine results
          {activeCount > 0 && <span className="gp-sidebar__badge">{activeCount}</span>}
        </h2>
        {activeCount > 0 && (
          <button type="button" className="gp-sidebar__clear" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <div className="gp-sidebar__body">
        {orderedLevels.length > 0 && (
          <fieldset className="gp-filter-group">
            <legend className="gp-filter-group__legend">Level</legend>
            <div className="gp-filter-group__options">
              {orderedLevels.map((level) => {
                const short = LEVEL_SHORT[level.value];
                const label = short && short !== level.value ? `${short} · ${level.value}` : level.value;
                return (
                  <FilterOption
                    key={level.value}
                    id={`filter-level-${level.value}`}
                    label={label}
                    count={level.count}
                    checked={chosen.level.includes(level.value)}
                    onChange={() => onToggle('level', level.value)}
                  />
                );
              })}
            </div>
          </fieldset>
        )}

        {degreeTypes.length > 0 && (
          <fieldset className="gp-filter-group">
            <legend className="gp-filter-group__legend">Degree type</legend>
            <div className="gp-filter-group__options">
              {degreeTypes.map((degree) => (
                <FilterOption
                  key={degree.code}
                  id={`filter-degree-${degree.code}`}
                  label={degree.label}
                  count={degree.count}
                  badge={degree}
                  checked={chosen.degree.includes(degree.code)}
                  onChange={() => onToggle('degree', degree.code)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {faculties.length > 0 && (
          <fieldset className="gp-filter-group">
            <legend className="gp-filter-group__legend">Faculty</legend>
            <div className="gp-filter-group__options">
              {faculties.map((faculty) => (
                <FilterOption
                  key={faculty.slug}
                  id={`filter-faculty-${faculty.slug}`}
                  label={faculty.name}
                  count={faculty.count}
                  checked={chosen.faculty.includes(faculty.slug)}
                  onChange={() => onToggle('faculty', faculty.slug)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {departments.length > 0 && (
          <fieldset className="gp-filter-group">
            <legend className="gp-filter-group__legend">Department</legend>
            <div className="gp-filter-group__options gp-filter-group__options--scroll">
              {departments.map((department) => (
                <FilterOption
                  key={department.slug}
                  id={`filter-department-${department.slug}`}
                  label={department.name}
                  count={department.count}
                  checked={chosen.department.includes(department.slug)}
                  onChange={() => onToggle('department', department.slug)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {campuses.length > 0 && (
          <fieldset className="gp-filter-group">
            <legend className="gp-filter-group__legend">Campus</legend>
            <div className="gp-filter-group__options">
              {campuses.map((campus) => (
                <FilterOption
                  key={campus.slug}
                  id={`filter-campus-${campus.slug}`}
                  label={campus.name}
                  count={campus.count}
                  checked={chosen.campus.includes(campus.slug)}
                  onChange={() => onToggle('campus', campus.slug)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {keywords.length > 0 && (
          <fieldset className="gp-filter-group">
            <legend className="gp-filter-group__legend">Keywords</legend>
            <div className="gp-filter-group__options gp-filter-group__options--scroll">
              {keywords.map((keyword) => (
                <FilterOption
                  key={keyword.slug}
                  id={`filter-keyword-${keyword.slug}`}
                  label={keyword.name}
                  count={keyword.count}
                  checked={chosen.keyword.includes(keyword.slug)}
                  onChange={() => onToggle('keyword', keyword.slug)}
                />
              ))}
            </div>
          </fieldset>
        )}
      </div>
    </aside>
  );
}

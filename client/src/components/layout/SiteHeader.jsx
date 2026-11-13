import { Link, useLocation } from 'react-router-dom';
import { MAIN_NAV, TOP_BAR_LINKS, UNIVERSITY } from '../../utils/constants.js';
import { useFaculties } from '../../hooks/useSite.js';
import './SiteHeader.css';

/** A nav item is active when its path matches or is a parent of the current one. */
function isLinkActive(to, location) {
  if (to === '/') {
    return location.pathname === '/';
  }
  return location.pathname === to || location.pathname.startsWith(`${to}/`);
}

export default function SiteHeader() {
  const location = useLocation();
  const { faculties } = useFaculties();

  return (
    <header className="site-header">
      <div className="site-header__utility">
        <div className="gp-container site-header__utility-inner">
          <ul className="site-header__utility-list">
            {TOP_BAR_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  className="site-header__utility-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="site-header__utility-contact">
            <i className="bi bi-envelope" aria-hidden="true" />
            <a className="site-header__utility-link" href={`mailto:${UNIVERSITY.emails[3].value}`}>
              {UNIVERSITY.emails[3].value}
            </a>
          </p>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg site-header__navbar" aria-label="Primary">
        <div className="gp-container site-header__inner">
          <Link className="site-header__brand" to="/">
            <span className="site-header__crest" aria-hidden="true">
              <i className="bi bi-bank" />
            </span>
            <span className="site-header__wordmark">
              {UNIVERSITY.name}
              <span className="site-header__wordmark-sub">Aspiring for Quality Education</span>
            </span>
          </Link>

          <button
            className="site-header__toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#uosPrimaryNav"
            aria-controls="uosPrimaryNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>

          <div className="collapse navbar-collapse site-header__collapse" id="uosPrimaryNav">
            <ul className="site-header__menu">
              {MAIN_NAV.map((item) => {
                const active = isLinkActive(item.to, location);
                const hasMenu = Boolean(item.mega) || Boolean(item.children);

                if (!hasMenu) {
                  return (
                    <li key={item.label}>
                      <Link
                        className={active ? 'site-header__link is-active' : 'site-header__link'}
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={item.label}
                    className={item.mega ? 'site-header__item is-mega' : 'site-header__item'}
                    data-mega={item.mega ? 'true' : undefined}
                  >
                    <button
                      className={active ? 'site-header__link is-active' : 'site-header__link'}
                      type="button"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="false"
                    >
                      {item.label}
                      <i className="bi bi-chevron-down site-header__caret" aria-hidden="true" />
                    </button>

                    {item.mega ? (
                      <div className="dropdown-menu site-header__mega">
                        <div className="site-header__mega-head">
                          <h2 className="site-header__mega-title">Faculties &amp; Departments</h2>
                          <Link className="site-header__mega-all" to="/faculties">
                            View all
                          </Link>
                        </div>
                        <ul className="site-header__mega-grid">
                          {faculties.length === 0 ? (
                            <li className="site-header__mega-empty">Loading faculties…</li>
                          ) : (
                            faculties.map((faculty) => (
                              <li key={faculty.slug}>
                                <Link
                                  className="site-header__mega-card"
                                  to={`/programs?faculty=${faculty.slug}`}
                                >
                                  <span className="site-header__mega-name">
                                    {faculty.shortName || faculty.name}
                                  </span>
                                  <span className="site-header__mega-meta">
                                    {faculty.departments.length} departments &middot;{' '}
                                    {faculty.programCount} programmes
                                  </span>
                                </Link>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    ) : (
                      <ul className="dropdown-menu site-header__dropdown">
                        {item.children.map((child) => (
                          <li key={child.to}>
                            <Link className="dropdown-item site-header__dropdown-link" to={child.to}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="site-header__actions">
              <Link className="gp-btn gp-btn--red gp-btn--sm" to="/programs">
                <i className="bi bi-search" aria-hidden="true" />
                Find a programme
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

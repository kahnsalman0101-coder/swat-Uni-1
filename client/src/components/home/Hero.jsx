import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UNIVERSITY, siteSearch } from '../../utils/constants.js';
import './Hero.css';

/**
 * The two notices the University currently publishes on its own site. Both
 * destinations point back to uswat.edu.pk (the admissions portal and the
 * university's own site search), never to an invented page.
 */
const NOTICES = [
  {
    icon: 'bi-clipboard-check',
    label: 'Final Merit List Fall 2026 (Self Finance)',
    href: 'https://cms1.uswat.edu.pk/admission/program/list/final'
  },
  {
    icon: 'bi-globe2',
    label: 'International Conference: One Planet One Health; Nature, Climate & Humanity',
    href: siteSearch('One Planet One Health')
  }
];

/**
 * Home hero: the University name and motto in an off-white field with a
 * CSS-only crest, a search field that hands off to the programme directory,
 * and links to the notices the University actually publishes.
 *
 * @param {{ lede?: string }} props First paragraph of the About University page.
 */
export default function Hero({ lede = '' }) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = term.trim();
    navigate(trimmed ? `/programs?search=${encodeURIComponent(trimmed)}` : '/programs');
  }

  return (
    <section className="gp-hero">
      <div className="gp-container gp-hero__inner">
        <div className="gp-hero__content">
          <h1 className="gp-hero__title">{UNIVERSITY.name}</h1>
          <p className="gp-hero__motto">{UNIVERSITY.motto}</p>

          {lede && <p className="gp-hero__lede">{lede}</p>}

          <form className="gp-hero__search" onSubmit={handleSubmit} role="search">
            <label className="gp-sr-only" htmlFor="hero-search">
              Search programmes
            </label>
            <i className="bi bi-search gp-hero__search-icon" aria-hidden="true" />
            <input
              id="hero-search"
              className="gp-hero__input"
              type="search"
              placeholder="Search by programme, department or keyword"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              autoComplete="off"
            />
            <button className="gp-btn gp-btn--red gp-hero__submit" type="submit">
              Search
            </button>
          </form>

          <div className="gp-hero__notices">
            <p className="gp-hero__notices-label">University notices</p>
            <ul className="gp-hero__notices-list">
              {NOTICES.map((notice) => (
                <li key={notice.label} className="gp-hero__notice">
                  <a
                    className="gp-hero__notice-link"
                    href={notice.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className={`bi ${notice.icon}`} aria-hidden="true" />
                    <span>{notice.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gp-hero__media" aria-hidden="true">
          <div className="gp-hero__crest">
            <span className="gp-hero__crest-initials">UOS</span>
            <span className="gp-hero__crest-rule" />
            <span className="gp-hero__crest-year">{UNIVERSITY.established}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { QUICK_MENU, SERVICE_LINKS, UNIVERSITY } from '../../utils/constants.js';
import './SiteFooter.css';

/** A quick-menu entry is either an internal route (`to`) or an external URL. */
function QuickMenuLink({ item }) {
  if (item.to) {
    return (
      <Link className="site-footer__link" to={item.to}>
        {item.label}
      </Link>
    );
  }
  return (
    <a className="site-footer__link" href={item.href} target="_blank" rel="noreferrer">
      {item.label}
    </a>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="gp-container site-footer__top">
        <div className="row g-4 g-lg-5">
          <div className="col-lg-4">
            <div className="site-footer__brand">
              <span className="site-footer__crest" aria-hidden="true">
                <i className="bi bi-bank" />
              </span>
              <span className="site-footer__wordmark">{UNIVERSITY.name}</span>
            </div>
            <p className="site-footer__motto">{UNIVERSITY.motto}</p>
            <address className="site-footer__address">
              {UNIVERSITY.address.line1}
              <br />
              {UNIVERSITY.address.line2}
              <br />
              {UNIVERSITY.address.line3}
            </address>
            <p className="site-footer__contact">
              <i className="bi bi-telephone" aria-hidden="true" />{' '}
              <a className="site-footer__link" href={`tel:${UNIVERSITY.phones[0].value}`}>
                {UNIVERSITY.phones[0].value}
              </a>
            </p>
            <p className="site-footer__contact">
              <i className="bi bi-envelope" aria-hidden="true" />{' '}
              <a className="site-footer__link" href={`mailto:${UNIVERSITY.emails[0].value}`}>
                {UNIVERSITY.emails[0].value}
              </a>
            </p>
          </div>

          <div className="col-sm-6 col-lg-4">
            <h2 className="site-footer__heading">Quick Menu</h2>
            <ul className="site-footer__list site-footer__list--split">
              {QUICK_MENU.map((item) => (
                <li key={item.label}>
                  <QuickMenuLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          <div className="col-sm-6 col-lg-2">
            <h2 className="site-footer__heading">Services</h2>
            <ul className="site-footer__list">
              {SERVICE_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    className="site-footer__link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="site-footer__heading site-footer__heading--spaced">Follow</h2>
            <ul className="site-footer__list">
              <li>
                <a
                  className="site-footer__link"
                  href="https://www.facebook.com/universityofswat"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-facebook" aria-hidden="true" /> Facebook
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2">
            <h2 className="site-footer__heading">Explore</h2>
            <ul className="site-footer__list">
              <li>
                <Link className="site-footer__link" to="/programs">
                  Programmes
                </Link>
              </li>
              <li>
                <Link className="site-footer__link" to="/faculties">
                  Faculties
                </Link>
              </li>
              <li>
                <Link className="site-footer__link" to="/campuses">
                  Campuses
                </Link>
              </li>
              <li>
                <Link className="site-footer__link" to="/vice-chancellor">
                  Vice Chancellor
                </Link>
              </li>
              <li>
                <Link className="site-footer__link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__strip">
        <div className="gp-container site-footer__strip-inner">
          <p className="site-footer__copyright">
            &copy; {year} University of Swat. Editorial content and programme details are
            sourced from{' '}
            <a
              className="site-footer__link"
              href={UNIVERSITY.website}
              target="_blank"
              rel="noreferrer"
            >
              uswat.edu.pk
            </a>
            .
          </p>
          <ul className="site-footer__legal">
            <li>
              <Link className="site-footer__link" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="site-footer__link" to="/faculties">
                Faculties
              </Link>
            </li>
            <li>
              <Link className="site-footer__link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

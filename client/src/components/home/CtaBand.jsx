import { Link } from 'react-router-dom';
import './CtaBand.css';

/** The University's real admissions portal. */
const ADMISSIONS_URL = 'https://cms1.uswat.edu.pk/admission/program/list/final';

/**
 * Closing call to action: green panel, red primary button to the real
 * admissions portal and a green outline button to the programme directory.
 */
export default function CtaBand() {
  return (
    <section className="gp-cta">
      <div className="gp-container">
        <div className="gp-cta__panel">
          <div className="gp-cta__text">
            <p className="gp-cta__eyebrow">Admissions</p>
            <h2 className="gp-cta__title">Ready to join the University of Swat?</h2>
            <p className="gp-cta__lede">
              Explore the programme directory to find the degree you are looking for, or
              continue to the University&rsquo;s official admissions portal for the current
              admission process.
            </p>
          </div>
          <div className="gp-cta__actions">
            <a
              className="gp-btn gp-btn--red gp-btn--lg"
              href={ADMISSIONS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Admissions portal
              <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
            </a>
            <Link className="gp-btn gp-btn--green gp-btn--lg" to="/programs">
              Browse programmes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

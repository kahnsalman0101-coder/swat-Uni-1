import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { UNIVERSITY, SERVICE_LINKS } from '../utils/constants.js';
import './ContactPage.css';

/** Build a dialable tel: target from a published phone number. */
function telHref(value) {
  return `tel:${String(value).replace(/[^\d+]/g, '')}`;
}

export default function ContactPage() {
  useDocumentTitle('Contact');

  return (
    <div className="gp-contact">
      <div className="gp-container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

        <header className="gp-contact__head">
          <p className="gp-eyebrow">Get in touch</p>
          <h1 className="gp-contact__title">Contact the University of Swat</h1>
          <p className="gp-lede">
            These are the address, telephone numbers and email addresses the university
            publishes on uswat.edu.pk.
          </p>
        </header>

        <div className="gp-contact__grid">
          <section className="gp-contact__card" aria-labelledby="contact-address">
            <h2 id="contact-address" className="gp-contact__card-title">
              Address
            </h2>
            <address className="gp-contact__address">
              {UNIVERSITY.address.line1}
              <br />
              {UNIVERSITY.address.line2}
              <br />
              {UNIVERSITY.address.line3}
            </address>
            <a
              className="gp-contact__website"
              href={UNIVERSITY.website}
              target="_blank"
              rel="noreferrer"
            >
              {UNIVERSITY.website}
              <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
            </a>
          </section>

          <section className="gp-contact__card" aria-labelledby="contact-phone">
            <h2 id="contact-phone" className="gp-contact__card-title">
              Telephone
            </h2>
            <ul className="gp-contact__list">
              {UNIVERSITY.phones.map((phone) => (
                <li key={phone.value} className="gp-contact__row">
                  <span className="gp-contact__label">{phone.label}</span>
                  <a className="gp-contact__value" href={telHref(phone.value)}>
                    {phone.value}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="gp-contact__card" aria-labelledby="contact-email">
            <h2 id="contact-email" className="gp-contact__card-title">
              Email
            </h2>
            <ul className="gp-contact__list">
              {UNIVERSITY.emails.map((email) => (
                <li key={email.value} className="gp-contact__row">
                  <span className="gp-contact__label">{email.label}</span>
                  <a className="gp-contact__value" href={`mailto:${email.value}`}>
                    {email.value}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="gp-contact__card" aria-labelledby="contact-services">
            <h2 id="contact-services" className="gp-contact__card-title">
              University services
            </h2>
            <ul className="gp-contact__list">
              {SERVICE_LINKS.map((service) => (
                <li key={service.href} className="gp-contact__row">
                  <a
                    className="gp-contact__value"
                    href={service.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {service.label}
                    <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="gp-contact__note">
          The details on this page are exactly those published on{' '}
          <a href={UNIVERSITY.website} target="_blank" rel="noreferrer">
            {UNIVERSITY.website}
          </a>
          .
        </p>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import './NotFoundPage.css';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <div className="gp-notfound">
      <div className="gp-container gp-notfound__inner">
        <p className="gp-notfound__code">404</p>
        <h1 className="gp-notfound__title">We could not find that page</h1>
        <p className="gp-notfound__text">
          The link may be out of date, or the program may have moved. Start from the
          directory and search again.
        </p>
        <div className="gp-notfound__actions">
          <Link className="gp-btn gp-btn--red gp-btn--lg" to="/programs">
            Browse programs
          </Link>
          <Link className="gp-btn gp-btn--green gp-btn--lg" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

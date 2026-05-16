import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <p className="not-found-eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="not-found-copy">This path does not exist in Relaxa. Let&apos;s bring you back to a calm space.</p>
        <div className="not-found-actions">
          <Link to="/dashboard" className="not-found-link not-found-link--primary">
            Go to Dashboard
          </Link>
          <Link to="/login" className="not-found-link">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;

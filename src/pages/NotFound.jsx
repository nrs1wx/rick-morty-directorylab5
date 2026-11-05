import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="message not-found">
      <p className="not-found-code">404</p>
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist or was moved.</p>
      <div className="message-links">
        <Link className="btn btn-primary" to="/">
          Go to Home
        </Link>
        <Link className="btn" to="/characters">
          All characters
        </Link>
      </div>
    </div>
  );
}

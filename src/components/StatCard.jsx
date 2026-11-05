import { Link } from "react-router-dom";

export default function StatCard({ label, value, hint, to }) {
  const content = (
    <>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {hint && <span className="muted">{hint}</span>}
    </>
  );

  if (to) {
    return (
      <Link className="stat-card stat-card-link" to={to}>
        {content}
      </Link>
    );
  }

  return <div className="stat-card">{content}</div>;
}

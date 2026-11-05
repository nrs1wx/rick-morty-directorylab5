import { Link } from "react-router-dom";

export default function BarList({ title, rows, total }) {
  const max = Math.max(1, ...rows.map((row) => row.value));

  return (
    <section className="panel" aria-label={title}>
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="muted">No data.</p>
      ) : (
        <ul className="bar-list">
          {rows.map((row) => {
            const percent = total === 0 ? 0 : Math.round((row.value / total) * 100);
            const label = (
              <span className="bar-label">
                {row.label}
                <span className="muted">
                  {row.value} · {percent}%
                </span>
              </span>
            );
            return (
              <li key={row.label}>
                {row.to ? (
                  <Link className="bar-row" to={row.to}>
                    {label}
                    <span className="bar-track">
                      <span className="bar-fill" style={{ width: `${(row.value / max) * 100}%` }} />
                    </span>
                  </Link>
                ) : (
                  <div className="bar-row">
                    {label}
                    <span className="bar-track">
                      <span className="bar-fill" style={{ width: `${(row.value / max) * 100}%` }} />
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

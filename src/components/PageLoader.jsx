export default function PageLoader() {
  return (
    <div className="message" role="status">
      <div className="spinner" aria-hidden="true" />
      <p className="muted">Loading page…</p>
    </div>
  );
}

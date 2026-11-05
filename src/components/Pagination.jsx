export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="btn" disabled={page <= 1} onClick={() => onPageChange(1)}>
        First
      </button>
      <button type="button" className="btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
      <button
        type="button"
        className="btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        Last
      </button>
    </nav>
  );
}

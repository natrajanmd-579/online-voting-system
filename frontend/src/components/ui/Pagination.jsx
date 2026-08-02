function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    for (let p = start; p <= end; p++) pages.push(p);

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                className="page-btn"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
            >
                ‹ Prev
            </button>

            {start > 1 && <span className="page-ellipsis">…</span>}

            {pages.map((p) => (
                <button
                    key={p}
                    className={`page-btn ${p === page ? "active" : ""}`}
                    onClick={() => onPageChange(p)}
                    aria-current={p === page ? "page" : undefined}
                >
                    {p}
                </button>
            ))}

            {end < totalPages && <span className="page-ellipsis">…</span>}

            <button
                className="page-btn"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
            >
                Next ›
            </button>
        </nav>
    );
}

export default Pagination;

function StatusBadge({ status }) {
    const normalized = (status || "").toLowerCase();
    return <span className={`status-badge status-${normalized}`}>{normalized}</span>;
}

export default StatusBadge;

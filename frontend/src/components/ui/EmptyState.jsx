function EmptyState({ title = "Nothing here yet", message = "", actionLabel, onAction, icon = "🗳️" }) {
    return (
        <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">{icon}</div>
            <h3>{title}</h3>
            {message && <p>{message}</p>}
            {actionLabel && onAction && (
                <button className="btn btn-primary" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default EmptyState;

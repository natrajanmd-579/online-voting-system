function ConfirmDialog({
    open,
    title = "Are you sure?",
    message = "",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    danger = false,
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
            <div className="modal-card">
                <h3>{title}</h3>
                {message && <p>{message}</p>}
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button
                        className={danger ? "btn btn-danger" : "btn btn-primary"}
                        onClick={onConfirm}
                        autoFocus
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;

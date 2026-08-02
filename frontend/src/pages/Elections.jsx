import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ElectionTable from "../components/ElectionTable";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import SearchInput from "../components/ui/SearchInput";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { getElections, deleteElection, activateElection, endElection } from "../services/electionService";

function Elections() {
    const [elections, setElections] = useState([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        loadElections(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, status]);

    const loadElections = async (page) => {
        setLoading(true);
        try {
            const res = await getElections({ page, limit: 10, search, status: status || undefined });
            setElections(res.data || []);
            setMeta(res.meta || { page: 1, totalPages: 1 });
        } catch (error) {
            toast.error("Failed to load elections");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => setPendingDeleteId(id);

    const confirmDelete = async () => {
        try {
            await deleteElection(pendingDeleteId);
            toast.success("Election deleted");
            loadElections(meta.page);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete election");
        } finally {
            setPendingDeleteId(null);
        }
    };

    const handleActivate = async (id) => {
        try {
            await activateElection(id);
            toast.success("Election activated");
            loadElections(meta.page);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to activate election");
        }
    };

    const handleEnd = async (id) => {
        try {
            await endElection(id);
            toast.success("Election ended");
            loadElections(meta.page);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to end election");
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Election Management</h1>
                <Link to="/add-election">
                    <button className="btn btn-primary">+ Add Election</button>
                </Link>
            </div>

            <div className="toolbar">
                <SearchInput placeholder="Search elections..." onSearch={setSearch} />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {loading ? (
                <Loader label="Loading elections..." />
            ) : elections.length === 0 ? (
                <EmptyState
                    title="No elections found"
                    message={search || status ? "Try adjusting your search or filter." : "Create your first election to get started."}
                />
            ) : (
                <>
                    <ElectionTable
                        elections={elections}
                        onDelete={handleDelete}
                        onActivate={handleActivate}
                        onEnd={handleEnd}
                    />
                    <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={loadElections} />
                </>
            )}

            <ConfirmDialog
                open={!!pendingDeleteId}
                title="Delete election?"
                message="This will permanently delete the election and all its candidates and votes. This cannot be undone."
                confirmLabel="Delete"
                danger
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
}

export default Elections;

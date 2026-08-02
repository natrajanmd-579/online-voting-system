import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CandidateTable from "../components/CandidateTable";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import SearchInput from "../components/ui/SearchInput";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { getCandidates, deleteCandidate } from "../services/candidateService";
import { getElections } from "../services/electionService";

function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [elections, setElections] = useState([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
    const [search, setSearch] = useState("");
    const [electionId, setElectionId] = useState("");
    const [loading, setLoading] = useState(true);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        getElections({ limit: 100 }).then((res) => setElections(res.data || [])).catch(() => {});
    }, []);

    useEffect(() => {
        loadCandidates(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, electionId]);

    const loadCandidates = async (page) => {
        setLoading(true);
        try {
            const res = await getCandidates({ page, limit: 10, search, electionId: electionId || undefined });
            setCandidates(res.data || []);
            setMeta(res.meta || { page: 1, totalPages: 1 });
        } catch (err) {
            toast.error("Failed to load candidates");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => setPendingDeleteId(id);

    const confirmDelete = async () => {
        try {
            await deleteCandidate(pendingDeleteId);
            toast.success("Candidate deleted");
            loadCandidates(meta.page);
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setPendingDeleteId(null);
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Candidate Management</h1>
                <Link to="/add-candidate">
                    <button className="btn btn-primary">+ Add Candidate</button>
                </Link>
            </div>

            <div className="toolbar">
                <SearchInput placeholder="Search candidates or party..." onSearch={setSearch} />
                <select value={electionId} onChange={(e) => setElectionId(e.target.value)}>
                    <option value="">All elections</option>
                    {elections.map((e) => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <Loader label="Loading candidates..." />
            ) : candidates.length === 0 ? (
                <EmptyState
                    title="No candidates found"
                    message={search || electionId ? "Try adjusting your search or filter." : "Add your first candidate to get started."}
                />
            ) : (
                <>
                    <CandidateTable candidates={candidates} onDelete={handleDelete} />
                    <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={loadCandidates} />
                </>
            )}

            <ConfirmDialog
                open={!!pendingDeleteId}
                title="Delete candidate?"
                message="This will permanently remove the candidate and their votes. This cannot be undone."
                confirmLabel="Delete"
                danger
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
}

export default Candidates;

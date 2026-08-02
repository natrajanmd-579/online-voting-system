import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getElections } from "../services/electionService";
import { getCandidates } from "../services/candidateService";
import { castVote, getVoteStatus } from "../services/voteService";
import { getFileUrl } from "../api/axios";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CountdownTimer from "../components/ui/CountdownTimer";
import "../styles/vote.css";

function Vote() {
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [voteStatus, setVoteStatus] = useState(null);
    const [pendingCandidate, setPendingCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadActiveElections();
    }, []);

    const loadActiveElections = async () => {
        setLoading(true);
        try {
            const res = await getElections({ status: "active", limit: 100 });
            const active = res.data || [];
            setElections(active);
            if (active.length > 0) await selectElection(active[0]);
        } catch (err) {
            toast.error("Failed to load active elections");
        } finally {
            setLoading(false);
        }
    };

    const selectElection = async (election) => {
        setSelectedElection(election);
        try {
            const [candidatesRes, statusRes] = await Promise.all([
                getCandidates({ electionId: election.id, limit: 100 }),
                getVoteStatus(election.id),
            ]);
            setCandidates(candidatesRes.data || []);
            setVoteStatus(statusRes.data);
        } catch (err) {
            toast.error("Failed to load candidates for this election");
        }
    };

    const confirmVote = async () => {
        if (!pendingCandidate) return;
        setSubmitting(true);
        try {
            await castVote(selectedElection.id, pendingCandidate.id);
            toast.success("Your vote has been cast successfully");
            setPendingCandidate(null);
            await selectElection(selectedElection);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to cast vote");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader label="Loading active elections..." />;

    if (elections.length === 0) {
        return (
            <div className="container">
                <EmptyState
                    title="No active elections right now"
                    message="Check back once an election is activated by an administrator."
                    icon="🗳️"
                />
            </div>
        );
    }

    return (
        <div className="container vote-page">
            <div className="page-header">
                <h1>Cast Your Vote</h1>
            </div>

            <div className="election-tabs" role="tablist">
                {elections.map((e) => (
                    <button
                        key={e.id}
                        role="tab"
                        aria-selected={selectedElection?.id === e.id}
                        className={`election-tab ${selectedElection?.id === e.id ? "active" : ""}`}
                        onClick={() => selectElection(e)}
                    >
                        {e.title}
                    </button>
                ))}
            </div>

            {selectedElection && (
                <div className="election-vote-panel">
                    <div className="election-vote-header">
                        <div>
                            <h2>{selectedElection.title}</h2>
                            <p>{selectedElection.description}</p>
                        </div>
                        <div className="countdown-box">
                            <span>Voting closes in</span>
                            <CountdownTimer target={selectedElection.end_date} doneLabel="Voting closed" />
                        </div>
                    </div>

                    {voteStatus && (
                        <div className="already-voted-banner">
                            ✅ You already voted in this election on{" "}
                            {new Date(voteStatus.voted_at).toLocaleString()}.
                        </div>
                    )}

                    {candidates.length === 0 ? (
                        <EmptyState title="No candidates yet" message="Candidates for this election haven't been added." />
                    ) : (
                        <div className="candidate-grid">
                            {candidates.map((c) => (
                                <div key={c.id} className="candidate-card">
                                    <div className="candidate-photo">
                                        {c.photo ? (
                                            <img src={getFileUrl(c.photo)} alt={c.name} />
                                        ) : (
                                            <div className="candidate-photo-placeholder">{c.name[0]}</div>
                                        )}
                                    </div>
                                    <h3>{c.name}</h3>
                                    <p className="candidate-party">{c.party} · {c.symbol}</p>
                                    {c.manifesto && <p className="candidate-manifesto">{c.manifesto}</p>}
                                    <button
                                        className="btn btn-primary"
                                        disabled={!!voteStatus}
                                        onClick={() => setPendingCandidate(c)}
                                    >
                                        {voteStatus ? "Already Voted" : "Vote for this candidate"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                open={!!pendingCandidate}
                title="Confirm your vote"
                message={
                    pendingCandidate
                        ? `You are about to vote for ${pendingCandidate.name} (${pendingCandidate.party}) in "${selectedElection?.title}". This action cannot be undone.`
                        : ""
                }
                confirmLabel={submitting ? "Submitting..." : "Confirm Vote"}
                onConfirm={confirmVote}
                onCancel={() => setPendingCandidate(null)}
            />
        </div>
    );
}

export default Vote;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { getElectionsList, getElectionResults } from "../services/dashboardService";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import SearchInput from "../components/ui/SearchInput";
import "../styles/results.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

function Results() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [elections, setElections] = useState([]);
    const [selectedId, setSelectedId] = useState(searchParams.get("electionId") || "");
    const [result, setResult] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getElectionsList();
                setElections(res.data || []);

                const requestedId = searchParams.get("electionId");
                const requestedExists = requestedId && res.data?.some((e) => String(e.id) === requestedId);

                if (requestedExists) {
                    setSelectedId(requestedId);
                } else if (res.data?.length > 0) {
                    setSelectedId(res.data[0].id);
                }
            } catch (err) {
                toast.error("Failed to load elections");
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!selectedId) return;
        setLoading(true);
        getElectionResults(selectedId)
            .then((res) => setResult(res.data))
            .catch(() => toast.error("Failed to load results"))
            .finally(() => setLoading(false));
    }, [selectedId]);

    const filteredCandidates = (result?.candidates || []).filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.party.toLowerCase().includes(search.toLowerCase())
    );

    const exportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(result.election.title, 14, 18);
        doc.setFontSize(10);
        doc.text(`Total votes cast: ${result.totalVotesCast}`, 14, 26);
        doc.text(
            `Winner: ${result.winner ? `${result.winner.name} (${result.winner.party})` : "N/A"}`,
            14,
            32
        );

        autoTable(doc, {
            startY: 38,
            head: [["Candidate", "Party", "Symbol", "Votes", "Share %"]],
            body: result.candidates.map((c) => [c.name, c.party, c.symbol, c.votesCount, `${c.percentage}%`]),
        });

        doc.save(`${result.election.title.replace(/\s+/g, "_")}_results.pdf`);
    };

    const exportExcel = () => {
        if (!result) return;
        const sheetData = result.candidates.map((c) => ({
            Candidate: c.name,
            Party: c.party,
            Symbol: c.symbol,
            Votes: c.votesCount,
            "Share (%)": c.percentage,
        }));
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
        XLSX.writeFile(workbook, `${result.election.title.replace(/\s+/g, "_")}_results.xlsx`);
    };

    if (elections.length === 0 && !loading) {
        return (
            <div className="container">
                <EmptyState title="No elections yet" message="Create an election to see results here." />
            </div>
        );
    }

    const chartLabels = (result?.candidates || []).map((c) => `${c.name} (${c.party})`);
    const chartVotes = (result?.candidates || []).map((c) => c.votesCount);

    return (
        <div className="container results-page">
            <div className="page-header">
                <h1>Election Results</h1>
                <div className="results-controls">
                    <select
                        value={selectedId}
                        onChange={(e) => {
                            setSelectedId(e.target.value);
                            setSearchParams({ electionId: e.target.value });
                        }}
                    >
                        {elections.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.title} ({e.status})
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-secondary" onClick={exportPDF} disabled={!result}>
                        📄 Export PDF
                    </button>
                    <button className="btn btn-secondary" onClick={exportExcel} disabled={!result}>
                        📊 Export Excel
                    </button>
                </div>
            </div>

            {loading && <Loader label="Loading results..." />}

            {!loading && result && (
                <>
                    <div className="winner-banner">
                        🏆 Winner:{" "}
                        <strong>
                            {result.winner ? `${result.winner.name} (${result.winner.party})` : "No votes cast yet"}
                        </strong>
                    </div>

                    <div className="summary-cards">
                        <div className="summary-card">
                            <h4>Total Votes Cast</h4>
                            <p>{result.totalVotesCast}</p>
                        </div>
                        <div className="summary-card">
                            <h4>Candidates</h4>
                            <p>{result.candidates.length}</p>
                        </div>
                        <div className="summary-card">
                            <h4>Status</h4>
                            <p>{result.election.computed_status || result.election.status}</p>
                        </div>
                    </div>

                    {result.candidates.length > 0 && (
                        <div className="charts-grid">
                            <div className="chart-box">
                                <h3>Vote Distribution</h3>
                                <Bar
                                    data={{
                                        labels: chartLabels,
                                        datasets: [
                                            {
                                                label: "Votes",
                                                data: chartVotes,
                                                backgroundColor: "rgba(59, 130, 246, 0.7)",
                                            },
                                        ],
                                    }}
                                    options={{ responsive: true, plugins: { legend: { display: false } } }}
                                />
                            </div>
                            <div className="chart-box">
                                <h3>Vote Share</h3>
                                <Pie
                                    data={{
                                        labels: chartLabels,
                                        datasets: [{ data: chartVotes, backgroundColor: COLORS }],
                                    }}
                                    options={{ responsive: true }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="table-container">
                        <div className="table-header">
                            <h3>Detailed Breakdown</h3>
                            <SearchInput placeholder="Search candidate or party..." onSearch={setSearch} />
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Party</th>
                                    <th>Symbol</th>
                                    <th>Votes</th>
                                    <th>Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCandidates.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="no-data">No matching candidates found</td>
                                    </tr>
                                ) : (
                                    filteredCandidates.map((c) => (
                                        <tr key={c.id}>
                                            <td>{c.name}</td>
                                            <td>{c.party}</td>
                                            <td>{c.symbol}</td>
                                            <td>{c.votesCount}</td>
                                            <td>{c.percentage}%</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default Results;
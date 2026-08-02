import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { getDashboardSummary, getElectionsList, getVoteTrends, getRecentActivity } from "../services/dashboardService";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";
import "../styles/dashboard.css";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const CARD_CONFIG = [
    { key: "totalUsers", label: "Total Users", className: "border-blue" },
    { key: "totalCandidates", label: "Total Candidates", className: "border-purple" },
    { key: "totalElections", label: "Total Elections", className: "border-amber" },
    { key: "totalVotes", label: "Total Votes Cast", className: "border-emerald" },
    { key: "activeElections", label: "Active Elections", className: "border-green" },
    { key: "completedElections", label: "Completed Elections", className: "border-gray" },
];

function Dashboard() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [elections, setElections] = useState([]);
    const [trends, setTrends] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [summaryRes, electionsRes, trendsRes, activityRes] = await Promise.all([
                getDashboardSummary(),
                getElectionsList(),
                getVoteTrends(),
                getRecentActivity(),
            ]);
            setMetrics(summaryRes.data);
            setElections(electionsRes.data || []);
            setTrends(trendsRes.data || []);
            setActivity(activityRes.data || []);
        } catch (err) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader label="Loading dashboard..." />;

    const trendChartData = {
        labels: trends.map((t) => new Date(t.date).toLocaleDateString()),
        datasets: [
            {
                label: "Votes per day",
                data: trends.map((t) => t.votes),
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59,130,246,0.15)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    return (
        <div className="container dashboard-container">
            <header className="dashboard-header">
                <h1>System Overview</h1>
                <button className="btn btn-secondary" onClick={loadAll}>Refresh Data</button>
            </header>

            <div className="metrics-grid">
                {CARD_CONFIG.map(({ key, label, className }) => (
                    <div key={key} className={`metric-card ${className}`}>
                        <h3>{label}</h3>
                        <p className="metric-value">{metrics?.[key] ?? 0}</p>
                    </div>
                ))}
            </div>

            <section className="chart-section">
                <h2>Voting Activity (Last 14 Days)</h2>
                {trends.length === 0 ? (
                    <EmptyState title="No votes yet" message="Vote activity will appear here once voting begins." />
                ) : (
                    <div className="chart-box">
                        <Line data={trendChartData} options={{ responsive: true }} />
                    </div>
                )}
            </section>

            <div className="dashboard-columns">
                <section className="elections-section">
                    <h2>Elections Overview</h2>
                    {elections.length === 0 ? (
                        <EmptyState
                            title="No elections yet"
                            message="Create your first election to get started."
                            actionLabel="Add Election"
                            onAction={() => navigate("/add-election")}
                        />
                    ) : (
                        <div className="elections-list">
                            {elections.map((el) => (
                                <div key={el.id} className="election-item-card">
                                    <div>
                                        <h4>{el.title}</h4>
                                        <StatusBadge status={el.status} />
                                    </div>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => navigate(`/results?electionId=${el.id}`)}
                                    >
                                        View Results
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="activity-section">
                    <h2>Recent Activity</h2>
                    {activity.length === 0 ? (
                        <EmptyState title="No recent activity" message="Activity will show up here as things happen." />
                    ) : (
                        <ul className="activity-list">
                            {activity.map((a, idx) => (
                                <li key={idx}>
                                    <span className={`activity-dot activity-${a.type}`} />
                                    <div>
                                        <p>{a.description}</p>
                                        <time>{new Date(a.occurred_at).toLocaleString()}</time>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
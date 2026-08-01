import React, { useEffect, useState } from 'react';
import { getDashboardSummary, getElectionResults } from '../services/dashboardService';
import '../styles/Dashboard.css';

// Import Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalElections: 0,
    totalVotes: 0,
    activeElections: 0,
    completedElections: 0
  });

  const [loading, setLoading] = useState(true);

  // Example election result state (using electionId = 1 as default)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Load summary numbers
      const summaryRes = await getDashboardSummary();
      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }

      // 2. Load election vote results for election #1
      const resultsRes = await getElectionResults(1);
      if (resultsRes.success && resultsRes.data.candidates) {
        const candidates = resultsRes.data.candidates;
        
        const labels = candidates.map(c => c.name);
        const votes = candidates.map(c => c.votesCount);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Votes Cast',
              data: votes,
              backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
              borderWidth: 1
            }
          ]
        });
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard Analytics...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Election Overview & Live Results</h2>

      {/* Metric Cards Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{summary.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Candidates</h3>
          <p>{summary.totalCandidates}</p>
        </div>
        <div className="stat-card">
          <h3>Total Elections</h3>
          <p>{summary.totalElections}</p>
        </div>
        <div className="stat-card">
          <h3>Total Votes Cast</h3>
          <p>{summary.totalVotes}</p>
        </div>
        <div className="stat-card highlight">
          <h3>Active Elections</h3>
          <p>{summary.activeElections}</p>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Live Votes per Candidate (Bar Chart)</h3>
          {chartData.labels.length > 0 ? (
            <Bar data={chartData} options={{ responsive: true }} />
          ) : (
            <p>No votes available yet.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Vote Distribution (Pie Chart)</h3>
          {chartData.labels.length > 0 ? (
            <Pie data={chartData} options={{ responsive: true }} />
          ) : (
            <p>No votes available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
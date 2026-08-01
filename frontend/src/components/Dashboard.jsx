import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/dashboard.css';

const Dashboard = ({ onSelectElection }) => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalElections: 0,
    activeElections: 0,
    completedElections: 0,
    totalVotes: 0
  });
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, electionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/summary'),
        axios.get('http://localhost:5000/api/dashboard/elections')
      ]);

      if (summaryRes.data.success) setMetrics(summaryRes.data.data);
      if (electionsRes.data.success) setElections(electionsRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading Dashboard Metrics...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>System Overview</h1>
        <button className="btn-refresh" onClick={fetchDashboardData}>Refresh Data</button>
      </header>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card border-blue">
          <h3>Total Users</h3>
          <p className="metric-value">{metrics.totalUsers}</p>
        </div>
        <div className="metric-card border-purple">
          <h3>Total Candidates</h3>
          <p className="metric-value">{metrics.totalCandidates}</p>
        </div>
        <div className="metric-card border-amber">
          <h3>Total Elections</h3>
          <p className="metric-value">{metrics.totalElections}</p>
        </div>
        <div className="metric-card border-emerald">
          <h3>Total Votes Cast</h3>
          <p className="metric-value">{metrics.totalVotes}</p>
        </div>
        <div className="metric-card border-green">
          <h3>Active Elections</h3>
          <p className="metric-value text-green">{metrics.activeElections}</p>
        </div>
        <div className="metric-card border-gray">
          <h3>Completed Elections</h3>
          <p className="metric-value text-gray">{metrics.completedElections}</p>
        </div>
      </div>

      {/* Quick Access Elections List */}
      <section className="elections-section">
        <h2>Elections Overview</h2>
        <div className="elections-list">
          {elections.map((el) => (
            <div key={el.id} className="election-item-card">
              <div>
                <h4>{el.title}</h4>
                <span className={`status-badge status-${el.status}`}>{el.status}</span>
              </div>
              <button 
                className="btn-view-results" 
                onClick={() => onSelectElection(el.id)}
              >
                View Analytics & Results
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
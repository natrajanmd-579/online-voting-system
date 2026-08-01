import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import '../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ElectionResults = ({ initialElectionId }) => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(initialElectionId || '');
  const [resultData, setResultData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      fetchResults(selectedElectionId);
    }
  }, [selectedElectionId]);

  const fetchElections = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/elections');
      if (res.data.success && res.data.data.length > 0) {
        setElections(res.data.data);
        if (!selectedElectionId) setSelectedElectionId(res.data.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching election list:', err);
    }
  };

  const fetchResults = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/dashboard/results/${id}`);
      if (res.data.success) {
        setResultData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  // Export Table Data to CSV
  const exportToCSV = () => {
    if (!resultData || !resultData.candidates) return;

    const headers = ['Candidate ID,Name,Party,Votes,Percentage\n'];
    const rows = resultData.candidates.map(
      (c) => `${c.candidate_id},"${c.candidate_name}","${c.party}",${c.vote_count},${c.vote_percentage}%`
    );

    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Election_Results_${selectedElectionId}.csv`;
    a.click();
  };

  // Filter candidates by search term
  const filteredCandidates = resultData?.candidates?.filter(
    (c) =>
      c.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.party.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Chart Data Configurations
  const chartLabels = resultData?.candidates.map((c) => `${c.candidate_name} (${c.party})`) || [];
  const chartVotes = resultData?.candidates.map((c) => c.vote_count) || [];

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Votes Received',
        data: chartVotes,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartVotes,
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
        ],
      },
    ],
  };

  return (
    <div className="results-container">
      {/* Control Panel: Filter & Export */}
      <div className="results-controls">
        <div className="select-group">
          <label htmlFor="election-select">Select Election:</label>
          <select
            id="election-select"
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
          >
            {elections.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.status})
              </option>
            ))}
          </select>
        </div>

        <button className="btn-export" onClick={exportToCSV} disabled={!resultData}>
          📥 Export CSV
        </button>
      </div>

      {loading && <div className="loading-spinner">Fetching live results...</div>}

      {resultData && !loading && (
        <>
          {/* Winner Banner */}
          <div className="winner-banner">
            🏆 Winner: <strong>{resultData.winner ? `${resultData.winner.candidate_name} (${resultData.winner.party})` : 'N/A'}</strong>
          </div>

          {/* Turnout & Summary Reports */}
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Total Votes Cast</h4>
              <p>{resultData.turnout.totalCast}</p>
            </div>
            <div className="summary-card">
              <h4>Eligible Voters</h4>
              <p>{resultData.turnout.totalEligible}</p>
            </div>
            <div className="summary-card">
              <h4>Voter Turnout</h4>
              <p>{resultData.turnout.turnoutPercentage}%</p>
            </div>
          </div>

          {/* Visualization Charts */}
          <div className="charts-grid">
            <div className="chart-box">
              <h3>Vote Distribution (Bar Chart)</h3>
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
            <div className="chart-box">
              <h3>Vote Share (Pie Chart)</h3>
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>

          {/* Detailed Results Table with Search */}
          <div className="table-container">
            <div className="table-header">
              <h3>Detailed Breakdown</h3>
              <input
                type="text"
                placeholder="Search candidate or party..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <table className="results-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Party</th>
                  <th>Votes</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c) => (
                  <tr key={c.candidate_id}>
                    <td>{c.candidate_name}</td>
                    <td>{c.party}</td>
                    <td>{c.vote_count}</td>
                    <td>{c.vote_percentage || 0}%</td>
                  </tr>
                ))}
                {filteredCandidates.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">No matching candidates found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ElectionResults;
import axios from 'axios';

// Base URL pointing to your backend server
const API_URL = 'http://localhost:5000/api/dashboard';

/**
 * Fetch total stats (Users, Candidates, Elections, Votes)
 */
export const getDashboardSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

/**
 * Fetch live vote counts and winner for a specific election
 */
export const getElectionResults = async (electionId) => {
  try {
    const response = await axios.get(`${API_URL}/results/${electionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching results for election ${electionId}:`, error);
    throw error;
  }
};
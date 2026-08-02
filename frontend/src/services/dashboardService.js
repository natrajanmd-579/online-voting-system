import API from "../api/axios";

export const getDashboardSummary = () => API.get("/dashboard/summary").then((r) => r.data);
export const getElectionsList = () => API.get("/dashboard/elections").then((r) => r.data);
export const getVoteTrends = () => API.get("/dashboard/vote-trends").then((r) => r.data);
export const getRecentActivity = () => API.get("/dashboard/recent-activity").then((r) => r.data);
export const getElectionResults = (electionId) =>
    API.get(`/dashboard/results/${electionId}`).then((r) => r.data);

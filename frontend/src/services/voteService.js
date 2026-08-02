import API from "../api/axios";

export const castVote = (election_id, candidate_id) =>
    API.post("/votes", { election_id, candidate_id }).then((r) => r.data);

export const getVoteHistory = () =>
    API.get("/votes/history").then((r) => r.data);

export const getVoteStatus = (electionId) =>
    API.get(`/votes/status/${electionId}`).then((r) => r.data);

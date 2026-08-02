import API from "../api/axios";

export const getCandidates = (params = {}) =>
    API.get("/candidates", { params }).then((r) => r.data);

export const getCandidateById = (id) =>
    API.get(`/candidates/${id}`).then((r) => r.data);

export const createCandidate = (formData) =>
    API.post("/candidates", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);

export const updateCandidate = (id, formData) =>
    API.put(`/candidates/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);

export const deleteCandidate = (id) =>
    API.delete(`/candidates/${id}`).then((r) => r.data);

import API from "../api/axios";

export const getElections = (params = {}) =>
    API.get("/elections", { params }).then((r) => r.data);

export const getElectionById = (id) =>
    API.get(`/elections/${id}`).then((r) => r.data);

export const createElection = (data) =>
    API.post("/elections", data).then((r) => r.data);

export const updateElection = (id, data) =>
    API.put(`/elections/${id}`, data).then((r) => r.data);

export const deleteElection = (id) =>
    API.delete(`/elections/${id}`).then((r) => r.data);

export const activateElection = (id) =>
    API.patch(`/elections/${id}/activate`).then((r) => r.data);

export const endElection = (id) =>
    API.patch(`/elections/${id}/end`).then((r) => r.data);

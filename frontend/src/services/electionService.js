import axios from "axios";

const API = "http://localhost:5000/api/elections";

export const getElections = async () => {
  const response = await axios.get(API);
  return response.data;
};

export const getElectionById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
};

export const createElection = async (data) => {
  const response = await axios.post(API, data);
  return response.data;
};

export const updateElection = async (id, data) => {
  const response = await axios.put(`${API}/${id}`, data);
  return response.data;
};

export const deleteElection = async (id) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};

export const activateElection = async (id) => {
  const response = await axios.put(`${API}/activate/${id}`);
  return response.data;
};

export const endElection = async (id) => {
  const response = await axios.put(`${API}/end/${id}`);
  return response.data;
};
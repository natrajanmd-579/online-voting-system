import axios from "axios";

const API = "http://localhost:5000/api/candidates";

export const getCandidates = async () => {
  const response = await axios.get(API);
  return response.data;
};

export const getCandidateById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
};

export const createCandidate = async (formData) => {
  const response = await axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateCandidate = async (id, formData) => {
  const response = await axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteCandidate = async (id) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};
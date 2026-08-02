import axios from "axios";

// Single source of truth for the API base URL. Set VITE_API_URL in
// .env (see .env.example) — falls back to localhost for local dev.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Centralized handling of expired/invalid sessions: any 401 clears the
// stored session and bounces the user back to login instead of every
// page having to special-case it.
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export const getFileUrl = (filename) => {
    if (!filename) return null;
    const origin = baseURL.replace(/\/api\/?$/, "");
    return `${origin}/uploads/candidates/${filename}`;
};

export default API;

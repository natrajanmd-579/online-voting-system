import API from "../api/axios";

export const registerUser = (data) => API.post("/auth/register", data).then((r) => r.data);
export const loginUser = (data) => API.post("/auth/login", data).then((r) => r.data);
export const getProfile = () => API.get("/auth/profile").then((r) => r.data);
export const updateProfile = (data) => API.put("/auth/profile", data).then((r) => r.data);
export const changePassword = (data) => API.put("/auth/change-password", data).then((r) => r.data);
export const logoutUser = () => API.post("/auth/logout").then((r) => r.data);

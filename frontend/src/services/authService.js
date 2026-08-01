import API from "../api/axios";

export const registerUser = (data) =>
    API.post("/auth/register", data);

export const loginUser = (data) =>
    API.post("/auth/login", data);

export const getProfile = () =>
    API.get("/auth/profile");

export const updateProfile = (data) =>
    API.put("/auth/profile", data);

export const changePassword = (data) =>
    API.put("/auth/change-password", data);

export const logout = () =>
    API.post("/auth/logout");
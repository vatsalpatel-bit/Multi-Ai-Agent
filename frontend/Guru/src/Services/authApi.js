import api from "./axios.js";

export const loginApi = async (token) => {
    const res = await api.post("/api/v1/auth/login", { token })
    return res.data;
};

export const logoutApi = async () => {
    const res = await api.post("/api/v1/auth/logout");
    return res.data;
}
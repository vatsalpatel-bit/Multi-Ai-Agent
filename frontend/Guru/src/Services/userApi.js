import api from "./axios.js"

export const getUserApi = async () => {
    const res = await api.get("/api/v1/user/me");
    return res.data;
};
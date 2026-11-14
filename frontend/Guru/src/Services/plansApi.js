import api from "./axios.js"

export const getPlansApi = async () => {
    try {
        const res = await api.get("/api/v1/payment/get/plans");
        return res.data;
    } catch {
        console.log("Plans api error")
    }
};

export const getPlanByIdApi = async (planId) => {
    const res = await api.get(`/api/v1/payment/get/plan/${planId}`);
    return res.data;
};

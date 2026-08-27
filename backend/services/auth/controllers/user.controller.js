import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase.js";

export const userApi = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = await getAuth(app).verifyIdToken(token);
        console.log(decoded);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
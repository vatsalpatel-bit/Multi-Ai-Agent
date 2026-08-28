import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

export const userApi = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not found",
            });
        };

        const decoded = await getAuth(app).verifyIdToken(token);

        let user = await User.findOne({
            firebaseUid: decoded.uid
        })
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture,
            })
        }
        const sessionId = crypto.randomUUID();
        redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }), "EX", 7 * 24 * 60 * 60);
        
        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
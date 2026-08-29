import redis from "../../shared/redis/redis.js";

const authMiddleware = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.session;
        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        };
        const session = await redis.get(`session:${sessionId}`);
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Unathorized"
            });
        };
        req.user = JSON.parse(session);
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        })
    }
}
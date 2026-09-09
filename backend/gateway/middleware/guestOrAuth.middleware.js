import crypto from "crypto";
import redis from "../../shared/redis/redis.js";

const guestOrAuthMiddleware = async (req, res, next) => {
    try {
        console.log("start")
        // Check authenticated user
        console.log("start")
        const sessionId = req.cookies?.session;
        if (sessionId) {

            const session = await redis.get(`session:${sessionId}`);
            if (session) {
                const data = JSON.parse(session);

                req.user = {
                    userId: data.userId,
                    type: "user"
                };

                return next();
            }
        }

        // No authenticated session → guest user
        let guestId = req.cookies?.guestSession;

        if (!guestId) {
            guestId = crypto.randomUUID();

            res.cookie("guestSession", guestId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });
        }

        req.user = {
            userId: guestId,
            type: "guest"
        };

        next();

    } catch (error) {
        console.error("Middleware error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export default guestOrAuthMiddleware;
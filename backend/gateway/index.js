import dotenv from "dotenv";
dotenv.config();
import express from "express";
import proxy from "express-http-proxy";
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import { proxyWithHeader } from "./config/proxyWithHeader.js";
import guestOrAuthMiddleware from "./middleware/guestOrAuth.middleware.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(
    "/api/v1/auth",
    proxy(process.env.AUTH_SERVICE, {
        proxyReqPathResolver: (req) => {
            return req.originalUrl;
        },
    })
);

app.use(
    "/api/v1/chat",
    guestOrAuthMiddleware,
    proxyWithHeader(process.env.CHAT_SERVICE)
);

app.use(
    "/api/v1/agent",
    guestOrAuthMiddleware,
    proxyWithHeader(process.env.AGENT_SERVICE)
);


app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`)
})


import dotenv from "dotenv"
dotenv.config();
import express from "express"
import connectDb from "./config/db.js";
import agentRouter from "./routes/agent.routes.js"

const app = express();

app.use(express.json());

app.use("/api/v1/agent", agentRouter)

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await connectDb();
        const server = app.listen(PORT, () => {
            console.log(`Server running on PORT:${PORT}`);
        });
        const shutdown = (signal) => {
            console.log(`${signal} received. Clossing server...`);

            server.close(async () => {
                try {
                    const mongoose = import("mongoose")
                    await mongoose.default.disconnect();
                    process.exit(0);
                } catch (error) {
                    console.log("Shutdown error", error);
                    process.exit(1);
                }
            });
        };

        process.once("SIGTERM", () => shutdown("SIGTERM"));
        process.once("SIGINT", () => shutdown("SIGINT"))

    } catch (error) {
        console.log("Application startup failed", error);
        process.exit(1);
    }
};

startServer();
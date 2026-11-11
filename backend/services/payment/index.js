import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    return res.status(200).json({
        message: "Server is running",
        success: true
    })
});

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`Server running on PORT:${PORT}`);
        });

        // Graceful shutdown
        const shutdown = (signal) => {
            console.log(`${signal} received. closing server...`);

            server.close(async () => {
                try {
                    const mongoose = import('mongoose');
                    await mongoose.default.disconnect();

                    console.log("MongoDB disconnected.");
                    process.exit(0);  //termination application

                } catch (error) {
                    console.log(`Shutdown error`, error);
                    process.exit(1)
                };
            });

            process.once("SIGTERM", () => shutdown("SIGTERM"));
            process.once("SIGINT", () => shutdown("SIGINT"));
        }
    } catch (error) {
        console.log("Application startup failed", error);
        process.exit(1)
    }
};

startServer();

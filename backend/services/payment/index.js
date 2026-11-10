import dotenv from "dotenv";
dotenv.config();
import express from "express";

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

    } catch (error) {
        console.log("Application startup failed", error);
        process.exit(1)
    }
};

startServer();

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";

const app = express();

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Hello from Auth"
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on PORT:${PORT}`);
})
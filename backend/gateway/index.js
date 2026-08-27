import dotenv from "dotenv";
dotenv.config();
import express from "express";
import proxy from "express-http-proxy";
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use("/api/v1/auth", proxy(process.env.AUTH_SERVICES))

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Hello from Gateway"
    });
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`)
})


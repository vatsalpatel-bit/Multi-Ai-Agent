import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";    
import authRouter from "./routes/user.router.js"

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    Credential: true,
}));

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Hello from Auth"
    });
});
app.use("/api/v1/auth", authRouter);
const PORT = process.env.PORT;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on PORT:${PORT}`);
})
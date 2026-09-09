import dotenv from "dotenv";
dotenv.config();

import express from "express"
import connectDb from "./config/db.js";
import chatRouter from "./routes/chat.routes.js"
// import cors from "cors"

const app = express();

app.use(express.json());

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }))

app.use("/api/v1/chat", chatRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    connectDb();
    console.log(`Server running on PORT:${PORT}`)
})
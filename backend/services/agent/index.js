import dotenv from "dotenv"
dotenv.config();
import express from "express"
import connectDb from "./config/db.js";


const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
    connectDb();
    console.log(`Server running on PORT:${PORT}`)
})
import express from "express";
import { agentApi } from "../controllers/agent.controller.js";

const router = express.Router();

router.post("/chat", agentApi);

export default router;
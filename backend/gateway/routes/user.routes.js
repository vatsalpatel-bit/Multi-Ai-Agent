import express from "express";
import { getCurrentUserApi } from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUserApi);

export default router;

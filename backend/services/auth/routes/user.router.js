import express from "express";
import { userApi } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", userApi);

export default router;
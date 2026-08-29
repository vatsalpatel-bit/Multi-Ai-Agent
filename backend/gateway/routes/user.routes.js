import express from "express";
import { getCurrentUserApi } from "../controller/user.controller.js";

const router = express.Router();

router.get("/me", getCurrentUserApi);

export default router;

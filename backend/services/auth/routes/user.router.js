import express from "express";
import { loginApi, logoutApi } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", loginApi);
router.post("/logout", logoutApi);

export default router;
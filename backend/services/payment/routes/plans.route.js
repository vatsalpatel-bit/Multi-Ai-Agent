import express from "express";
import { getPlanById, getPlans } from "../controller/plans.controller.js";
const router = express.Router();

router.get("/get/plans", getPlans);
router.get("/get/plan/:id", getPlanById);

export default router;
import express from "express";
import { getConversationsApi, getMessagesApi, getUserMessagesApi, saveConversationApi, saveMessageApi, updateConversationApi } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/c", saveConversationApi);
router.get("/get/c", getConversationsApi);
router.post("/update/c", updateConversationApi);
router.post("/m", saveMessageApi);
router.get("/get/m/:conversationId", getMessagesApi);
router.get("/get/m/:userId", getUserMessagesApi);

export default router;


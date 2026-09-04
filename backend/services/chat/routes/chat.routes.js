import express from "express";
import { getConversationsApi, getMessagesApi, saveConversationApi, saveMessageApi, updateConversationApi } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/c", saveConversationApi);
router.get("/get/c", getConversationsApi);
router.post("/update/c", updateConversationApi);
router.post("/m", saveMessageApi);
router.get("/get/m/:conversationId", getMessagesApi);

export default router;


import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const saveConversationApi = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        console.log(userId);
        const conversation = await Conversation.create({
            userId,
        });
        return res.status(200).json(conversation)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
};

export const getConversationsApi = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        const conversations = await Conversation.find({
            userId,
        }).sort({ createdAt: -1 });
        if (conversations.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        };
        return res.staus(200).json(conversations);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export const updateConversationApi = async (req, res) => {
    try {
        const { conversationId, title } = req.body;
        const conversation = await Conversation.findByIdAndUpdate(conversationId, { title });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            })
        };
        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export const saveMessageApi = async (req, res) => {
    try {

        const { conversationId, role, content } = req.body;
        const userId = req.headers["x-user-id"];
        const type = req.headers["x-user-type"];
        const message = await Message.create({
            conversationId, role, content, userId, type
        });
        return res.staus(200).json(message);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
};

export const getMessagesApi = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        const messages = await Message.find({
            userId,
            conversationId: req.params.conversationId
        }).sort({ createdAt: 1 });

        if (messages.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Messages not found"
            })
        }
        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
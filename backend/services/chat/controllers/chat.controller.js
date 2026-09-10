import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const saveConversationApi = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                message: "User identity is required"
            });
        }

        const conversation = await Conversation.create({
            userId,
            userType
        });

        const conversationId = conversation._id
        console.log(conversationId)
        return res.status(201).json(conversationId);

    } catch (error) {
        console.error("SAVE CONVERSATION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getConversationsApi = async (req, res) => {
    try {
        // console.log("Start")
        const userId = req.headers["x-user-id"]
        // console.log(userId)
        const conversations = await Conversation.find({
            _id: userId,
        }).sort({ createdAt: -1 });
        // console.log(conversations)
        return res.status(200).json(conversations);
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
        console.log(conversationId, role, content)
        const message = await Message.create({
            conversationId, role, content,
        });

        return res.status(200).json(message);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getMessagesApi = async (req, res) => {
    try {
        const conversationId = req.params?.conversationId;

        const messages = await Message.find({
            conversationId,
        }).sort({ createdAt: 1 });

        if (messages.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Messages not found"
            })
        }
        return res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

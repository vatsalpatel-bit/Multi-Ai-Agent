import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const saveConversationApi = async (req, res) => {
    try {
        console.log("1")
        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                message: "User identity is required"
            });
        }
        console.log("2")
        const conversation = await Conversation.create({
            userId,
            userType
        });
        return res.status(201).json(conversation);

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


        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];


        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                message: "User identity is required"
            });
        }

        const conversations = await Conversation
            .find({
                userId,
                userType
            })
            .sort({ createdAt: -1 });



        return res.status(200).json({
            success: true,
            conversations
        });

    } catch (error) {
        console.error("GET CONVERSATIONS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateConversationApi = async (req, res) => {
    try {
        const { conversationId, title } = req.body;

        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
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
        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];

        const { conversationId, role, content } = req.body;

        const message = await Message.create({
            conversationId,
            role,
            content,
            userId,
            userType
        });

        await Conversation.findOneAndUpdate(
            {
                conversationId,
                userId,
                userType
            },
            {
                $set: {
                    updatedAt: new Date()
                }
            }
        );

        return res.status(201).json(message);

    } catch (error) {
        console.error("SAVE MESSAGE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getMessagesApi = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];

        const conversationId = req.params?.conversationId;

        const messages = await Message.find({
            conversationId, userId, userType
        }).sort({ createdAt: 1 });

        return res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import redis from "../../../shared/redis/redis.js";
import { genTitleAgent } from "../agent/titleGenAgent.js";

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

        const message = req.body?.message?.trim();

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const generatedTitle = await genTitleAgent(message);
        const title = generatedTitle.trim() ?? "New chat";

        const conversation = await Conversation.create({
            title,
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

        await Conversation.findOneAndUpdate(
            {
                _id: conversationId,
                userId,
                userType
            },
            {
                $set: {
                    updatedAt: new Date()
                }
            }
        );

        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export const deleteConversationApi = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { conversationId } = req.body || {};

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "Conversation id is required"
            });
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            userId: userId
        });

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        };

        await Conversation.deleteOne({ _id: conversationId });

        await Message.deleteMany({ conversationId: conversationId });

        const key = `messages-${userId}`
        const cached = await redis.get(key);

        if (cached) {
            const messages = JSON.parse(cached);
            const latestMessages = messages.filter(msg => msg.conversationId.toString() !== conversationId.toString());
            await redis.set(key, JSON.stringify(latestMessages))
        }

        return res.status(200).json({ message: "Delete conversation successfully" })

    } catch (error) {
        console.log(error)
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

export const getUserMessagesApi = async (req, res) => {
    try {
        const userId = req.params?.userId;
        const messages = await Message.find({
            userId
        }).sort({ createdAt: 1 }).limit(50);

        return res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

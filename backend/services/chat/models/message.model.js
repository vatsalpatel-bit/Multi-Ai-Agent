import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true
        },

        role: {
            type: String,
            required: true,
            enum: ["user", "assistant"]
        },

        content: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true,
            index: true
        },

        userType: {
            type: String,
            enum: ["user", "guest"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

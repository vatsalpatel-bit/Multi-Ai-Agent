import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
    title: {
        type: String,
        default: "New chat",
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
}, {
    timestamps: true,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
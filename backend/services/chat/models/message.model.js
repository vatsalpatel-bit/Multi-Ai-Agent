import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: String,
    content: String
}, {
    _id: false
});

const artifactSchema = new mongoose.Schema({
    id: Number,
    type: String,
    files: [fileSchema]
}, {
    _id: false
})

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
        images: {
            type: [String],
            default: []
        },
        artifacts: [artifactSchema],
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

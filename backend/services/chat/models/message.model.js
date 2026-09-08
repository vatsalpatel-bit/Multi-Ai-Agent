import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    conversationId: {
        type: String,
    },
    userId: {
        type: String,
    },
    type: {
        type: String,
        enum: ['user', 'guest']
    },
    role: {
        type: String,
        enum: ['user', 'assistant']
    },
    content: String,
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
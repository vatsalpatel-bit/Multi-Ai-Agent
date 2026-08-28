import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    avatar: {
        type: String,
    }
}, {
    timestamps: true
});

const User = new mongoose.model("User", userSchema);
export default User;
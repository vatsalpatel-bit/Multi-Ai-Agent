import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    avatar: {
        type: String,
    }
});

const User = new mongoose.model("User", userSchema);
export default User;
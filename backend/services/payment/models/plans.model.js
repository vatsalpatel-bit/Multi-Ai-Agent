import mongoose from "mongoose";

const plansSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        enum: ["starter", "pro", "team"],
    },
    token: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    popular: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const Plans = mongoose.model("Plans", plansSchema);

export default Plans;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    credits:{
        type: Number,
        default: 100
    },
    plan: {
        type: String,
        enum: ["Free", "Pro", "Enterprise"],
        default: "Free",          // ← New
    },
    planActivatedAt: {
        type: Date,
        default: null,            // ← New
    }

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)
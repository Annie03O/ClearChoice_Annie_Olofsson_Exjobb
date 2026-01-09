"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema_1 = require("../models/schemas/userSchema");
const updateMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const { name, email, password } = req.body;
        const user = await userSchema_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (typeof name === "string" && name.trim()) {
            user.name = name.trim();
        }
        if (typeof email === "string" && email.trim()) {
            user.email = email.trim();
        }
        if (typeof password === "string" && password.trim()) {
            const hashed = await bcrypt_1.default.hash(password.trim(), 10);
            user.passwordHash = hashed;
        }
        await user.save();
    }
    catch (error) {
        console.error("[updatedMe] Error:", error);
        return res.status(500).json({ message: "Failed to update user" });
    }
};
exports.updateMe = updateMe;

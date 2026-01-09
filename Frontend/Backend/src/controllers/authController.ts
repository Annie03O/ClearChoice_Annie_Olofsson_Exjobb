import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/schemas/userSchema";

export const updateMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({message: "Not authenticated"});
        }

        const {name, email, password} = req.body as {
            name?: string;
            email?: string;
            password?: string; 
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        if (typeof name === "string" && name.trim()) {
            user.name = name.trim()
        }

        if (typeof email === "string" && email.trim()) {
            user.email = email.trim()
        }

        if (typeof password === "string" && password.trim()) {
            const hashed = await bcrypt.hash(password.trim(), 10);
            user.passwordHash = hashed;
        }

        await user.save()
    } catch (error) {
        console.error("[updatedMe] Error:", error);
        return res.status(500).json({ message: "Failed to update user"})
        
        
    }
}
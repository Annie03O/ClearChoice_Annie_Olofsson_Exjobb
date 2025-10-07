import { JWT_SECRET } from "../middlewares/env";
import { User } from "../models/userSchema";
import { app } from "../server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookieOpts } from "../models/cookieOpts";

app.post("/api/ath/register", async (req, res) => {
    try {
        const { name, email, password} = req.body;

        if (!name.trim()) {
            return res.status(400).json({ error: "Name is required" });
        }
        if (!email.trim()) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!password.trim()) {
            return res.status(400).json({ error: "Password is required" });
        }

        const existingEmail = await User.findOne({ email: email.toLowerCase()});
        if (existingEmail) return res.status(400).json({ error: "Email is taken" });

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            passwordHash,
        })

        const token = jwt.sign({ id: user._id}, JWT_SECRET as string, {
            expiresIn: "7d",
        })

        res.cookie("token", token, cookieOpts as object)

        res.json({
            user: { 
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error"})
        
    }
})
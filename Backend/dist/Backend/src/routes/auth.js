"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Auth_1 = require("../middlewares/Auth");
const userSchema_1 = require("../models/schemas/userSchema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
function makeAccessToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "10m" });
}
function makeRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: true, // Always true since we're using HTTPS (GitHub Pages to localhost requires this)
    sameSite: "none", // Required for cross-origin cookies
    path: "/",
};
// Middleware to prevent caching on auth routes
router.use((req, res, next) => {
    res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    });
    next();
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }
    try {
        const userDoc = await userSchema_1.User.findOne({ email: email.toLowerCase() }).exec();
        if (!userDoc) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const passwordMatches = await bcryptjs_1.default.compare(password, userDoc.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const payload = { id: userDoc._id.toString(), email: userDoc.email };
        const access = makeAccessToken(payload);
        const refresh = makeRefreshToken(payload);
        console.log("Login attempt:", email);
        res.cookie("accessToken", access, cookieOptions);
        res.cookie("refreshToken", refresh, cookieOptions);
        const user = {
            id: userDoc._id.toString(),
            email: userDoc.email,
            name: userDoc.name
        };
        return res.json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // For now, just accept any registration and log them in
        // In production, you'd validate input, check if user exists, hash password, save to DB
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password required" });
        }
        const existing = await userSchema_1.User.findOne({ email: email.toLowerCase() }).exec();
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // Create new user (in-memory for demo)
        const userDoc = await userSchema_1.User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
        });
        const payload = { id: userDoc._id.toString(), email: userDoc.email };
        const accessToken = makeAccessToken(payload);
        const refreshToken = makeRefreshToken(payload);
        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);
        const user = {
            id: userDoc._id.toString(),
            email: userDoc.email,
            name: userDoc.name
        };
        return res.status(201).json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/refresh", (req, res) => {
    const rt = req.cookies?.refreshToken;
    if (!rt)
        return res.status(401).json({ message: "No refresh token" });
    try {
        const payload = jsonwebtoken_1.default.verify(rt, process.env.JWT_SECRET);
        const newAccess = makeAccessToken(payload);
        const newRefresh = makeRefreshToken(payload); // rotation
        res.cookie("accessToken", newAccess, cookieOptions);
        res.cookie("refreshToken", newRefresh, cookieOptions);
        return res.json({ ok: true });
    }
    catch {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
});
router.get("/me", Auth_1.requireAuth, async (req, res) => {
    try {
        const user = req.user;
        // Fetch full user data from database to get name
        const userDoc = await userSchema_1.User.findById(user.id).exec();
        if (!userDoc) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            id: userDoc._id.toString(),
            email: userDoc.email,
            name: userDoc.name
        });
    }
    catch (err) {
        console.error("[/me] Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.put("/me", Auth_1.requireAuth, authController_1.updateMe);
router.post("/logout", (_req, res) => {
    res.clearCookie("accessToken", {
        path: "/",
        sameSite: cookieOptions.sameSite,
        secure: cookieOptions.secure
    });
    res.clearCookie("refreshToken", {
        path: "/",
        sameSite: cookieOptions.sameSite,
        secure: cookieOptions.secure
    });
    res.json({ ok: true });
});
router.post("/saveSize", Auth_1.requireAuth, async (req, res) => {
    // Här kan du läsa ut användaren
    const user = req.user;
    // Här kan du läsa ut storleksdata från frontend
    const { sizeProfile } = req.body;
    // TODO: spara sizeProfile i databasen kopplad till user.id
    // t.ex. i User-modellen eller i en separat Size-model
    console.log("[saveSize] for user", user.email, "data:", sizeProfile);
    return res.json({
        ok: true,
        message: "Size profile saved (stub).",
        sizeProfile: sizeProfile ?? null,
    });
});
exports.default = router;

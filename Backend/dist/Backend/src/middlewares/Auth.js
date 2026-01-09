"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookieOptions = {
    httpOnly: true,
    secure: true, // Always true since we're using HTTPS (GitHub Pages to localhost requires this)
    sameSite: "none", // Required for cross-origin cookies
    path: "/",
};
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
}
function requireAuth(req, res, next) {
    const access = req.cookies?.accessToken;
    const refresh = req.cookies?.refreshToken;
    // 1) Har vi en access-token och den funkar? Kör vidare.
    if (access) {
        try {
            req.user = verifyToken(access);
            return next();
        }
        catch {
            // fall through till refresh-försök
        }
    }
    // 2) Om access saknas/är ogiltig, försök skapa ny från refresh.
    if (!refresh) {
        return res.status(401).json({ message: "No token" });
    }
    try {
        const payload = verifyToken(refresh); // använder samma JWT_SECRET i din kod
        const newAccess = jsonwebtoken_1.default.sign({ id: payload.id, email: payload.email }, process.env.JWT_SECRET, { expiresIn: "10m" });
        res.cookie("accessToken", newAccess, cookieOptions);
        req.user = { id: payload.id, email: payload.email, name: payload.name };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}

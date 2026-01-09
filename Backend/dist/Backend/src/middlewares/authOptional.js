"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.authOptional = authOptional;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
}
function authOptional(req, _res, next) {
    const access = req.cookies?.accessToken;
    if (access) {
        try {
            req.user = verifyToken(access);
        }
        catch {
            // ignorera bara
        }
    }
    next();
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOpts = void 0;
const isProd = process.env.NODE_ENV === 'production';
exports.cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

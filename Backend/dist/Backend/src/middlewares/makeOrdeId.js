"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOrderId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const makeOrderId = () => {
    const code = crypto_1.default.randomBytes(5).toString("hex").slice(0, 8).toUpperCase();
    return `CC-${code}`;
};
exports.makeOrderId = makeOrderId;

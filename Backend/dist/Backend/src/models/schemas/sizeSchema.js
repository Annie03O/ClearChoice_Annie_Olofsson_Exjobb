"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSizes = exports.userSizeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSizeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    shoulderSize: { type: Number, required: true },
    chestSize: { type: Number, required: true },
    waistSize: { type: Number, required: true },
}, { timestamps: true });
exports.UserSizes = (0, mongoose_1.model)("UserSizes", exports.userSizeSchema);

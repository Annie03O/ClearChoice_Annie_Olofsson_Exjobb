"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSizes = void 0;
const mongoose_1 = require("mongoose");
const sizeSchema_1 = require("../models/schemas/sizeSchema");
const getUserSizes = (userId) => {
    const userObjectId = typeof userId === "string" ? new mongoose_1.Types.ObjectId(userId) : userId;
    return sizeSchema_1.UserSizes.findOne({ userId: userObjectId }).lean();
};
exports.getUserSizes = getUserSizes;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserSizes = void 0;
const mongoose_1 = require("mongoose");
const sizeSchema_1 = require("../models/schemas/sizeSchema");
const saveUserSizes = async (input) => {
    const userObjectId = typeof input.userId === "string" ? new mongoose_1.Types.ObjectId(input.userId) : input.userId;
    const doc = await sizeSchema_1.UserSizes.findOneAndUpdate({ userId: userObjectId }, {
        $set: {
            shoulderSize: input.shoulderSize,
            chestSize: input.chestSize,
            waistSize: input.waistSize
        },
    }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
    return doc;
};
exports.saveUserSizes = saveUserSizes;

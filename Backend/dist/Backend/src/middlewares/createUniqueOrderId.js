"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUniqueOrderId = void 0;
const orderSchema_1 = require("../models/schemas/orderSchema");
const makeOrdeId_1 = require("./makeOrdeId");
const createUniqueOrderId = async (payload, session) => {
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            return await orderSchema_1.OrderModel.create([payload], { session });
        }
        catch (err) {
            if (err?.code === 11000 && err?.keyPattern?.orderNumber) {
                payload.orderNumber = (0, makeOrdeId_1.makeOrderId)();
                continue;
            }
            throw err;
        }
    }
    throw new Error("Couldn't generate a unique order number.");
};
exports.createUniqueOrderId = createUniqueOrderId;

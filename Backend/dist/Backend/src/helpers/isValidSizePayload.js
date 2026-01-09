"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSizePayload = isValidSizePayload;
function isValidSizePayload(body) {
    return (typeof body === "object" && body !== null &&
        typeof body.shoulderSize === "number" &&
        typeof body.chestSize === "number" &&
        typeof body.waistSize === "number" &&
        body.shoulderSize > 0 && body.chestSize > 0 && body.waistSize > 0);
}

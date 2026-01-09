"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialPaymentStatus = initialPaymentStatus;
function initialPaymentStatus(method) {
    switch (method) {
        case "CARD":
        case "SWISH":
        case "PAYPAL":
        case "KLARNA":
            return "PAID";
        default:
            return "PENDING";
    }
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.OrderSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AddressSchema_1 = require("./AddressSchema");
// ✅ Inline schema för orderrader
const OrderItemSchema = new mongoose_1.Schema({
    productId: { type: String, required: true },
    productNameSnapshot: { type: String, required: true },
    unitPriceSnapshot: { type: Number, required: true },
    imageUrlSnapshot: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    color: { type: String },
    size: { type: String }, // eller Number – men då måste frontend skicka Number
}, { _id: false });
exports.OrderSchema = new mongoose_1.Schema({
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: "EURO" },
    shippingMethodId: { type: String },
    paymentMethod: {
        type: String,
        enum: ["CARD", "KLARNA", "PAYPAL", "SWISH"],
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "SHIPPED"],
        default: "PENDING",
    },
    paymentStatus: {
        type: String,
        enum: ["UNPAID", "AUTHORIZED", "PAID", "REFUNDED"],
        default: "UNPAID",
    },
    address: { type: AddressSchema_1.AddressSchema, required: true },
    paymentRef: { type: String },
    guestTokenHash: {
        type: String
    }
}, { timestamps: true });
exports.OrderModel = mongoose_1.default.model("Order", exports.OrderSchema);

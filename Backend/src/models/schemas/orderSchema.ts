import mongoose, { Schema, InferSchemaType } from "mongoose";
import { AddressSchema } from "./AddressSchema";

// ✅ Inline schema för orderrader
const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    productNameSnapshot: { type: String, required: true },
    unitPriceSnapshot: { type: Number, required: true },
    imageUrlSnapshot: {type: String, required: true},
    qty: { type: Number, required: true, min: 1 },
    color: { type: String },
    size: { type: String }, // eller Number – men då måste frontend skicka Number

  },
  { _id: false }
);

export const OrderSchema = new Schema(
  {
    orderNumber: {type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
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

    address: { type: AddressSchema, required: true },
    paymentRef: { type: String },
    guestTokenHash: {
      type: String

    }
  },
  { timestamps: true }
);

export type Order = InferSchemaType<typeof OrderSchema>;
export const OrderModel = mongoose.model("Order", OrderSchema);

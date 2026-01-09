// routes/Order.ts
import express from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import { products } from "../models/objects/products";
import { OrderModel } from "../models/schemas/orderSchema";
import { authOptional } from "../middlewares/authOptional";
import { Color } from "../models/types/Product";
import { makeOrderId } from "../middlewares/makeOrdeId";
import { createUniqueOrderId } from "../middlewares/createUniqueOrderId";
import { initialPaymentStatus } from "../middlewares/initialPaymentStatus";

const router = express.Router();

const makeToken = () => crypto.randomBytes(24).toString("hex");
const hashToken = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

// ✅ Viktigt: authOptional FÖRE alla routes, även POST /orders
router.use(authOptional);

router.post("/orders", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user?.id;

    const {
      email,
      items,
      shippingFee,
      paymentMethod,
      address,
      shippingMethodId,
    } = req.body as {
      email: string;
      items: { productId: string; qty: number; color?: string; size?: string }[];
      shippingFee: number;
      paymentMethod: "CARD" | "KLARNA" | "PAYPAL" | "SWISH" ;
      address: any;
      shippingMethodId?: string;
    };

    console.log("[POST /orders] req.user?.id =", userId);

    if (!email || !items?.length) {
      return res.status(400).json({ message: "email och items krävs" });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // validera + räkna subtotal
    let subtotal = 0;
    for (const i of items) {
      const p = productMap.get(i.productId);

      if (!p) {
        return res.status(400).json({ message: `Ogiltigt productId: ${i.productId}` });
      }
      if (!Number.isInteger(i.qty) || i.qty < 1) {
        return res.status(400).json({ message: `Ogiltig qty för ${i.productId}` });
      }

      subtotal += (p.price ?? 0) * i.qty;
    }

    const total = subtotal + (shippingFee ?? 0);

    const orderItems = items.map((i) => {
      const p = products.find((x) => String(x.id) === String(i.productId));
      if (!p) throw new Error(`Product not found ${i.productId}`);

      const isColor = (v: string): v is Color => 
        v === "black" || v === "white" || v === "grey";
      
      const raw = (i.color ?? "").toLowerCase();
      const colorKey = isColor(raw) ? raw : undefined;

      const imageUrlSnapshot =
        (colorKey ? p.images?.[colorKey]: undefined) ||
        p.images?.black ||
        p.images?.white ||
        p.images?.grey ||
        "";

      return {
        productId: i.productId,
        productNameSnapshot: p.label,
        unitPriceSnapshot: p.price ?? 0,
        qty: i.qty,
        color: i.color,
        size: i.size,
        imageUrlSnapshot,
      };
    });

    console.log("ORDERITEMS[0] about to save:", orderItems[0]);
    console.log("imageUrlSnapshot value:", orderItems[0]?.imageUrlSnapshot);

    // ✅ Om inloggad → ingen token behövs. Om gäst → skapa guestToken.
    const guestToken = userId ? null : makeToken();
    const guestTokenHash = guestToken ? hashToken(guestToken) : undefined;

    let createdOrder: any;
    const paymentStatus = initialPaymentStatus(paymentMethod);

    await session.withTransaction(async () => {
      const payload = {
        orderNumber: makeOrderId(),
        userId: userId ?? null,
        guestTokenHash,
        email,
        items: orderItems,
        subtotal,
        shippingFee: shippingFee ?? 0,
        total,
        currency: "EUR",
        paymentMethod,
        status: "PENDING",
        paymentStatus, // ✅ här
        address,
        shippingMethodId,
      };
    
      // Viktigt: se till att createUniqueOrderId returnerar ett dokument (inte array),
      // annars måste du hantera det konsekvent.
      createdOrder = await createUniqueOrderId(payload, session);
    });



    const order = Array.isArray(createdOrder) ? createdOrder[0] : createdOrder;

    return res.status(201).json({
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      currency: order.currency,
      userId: userId ?? null,
      // ✅ returnera guestToken bara om det är en gästorder
      guestToken: guestToken ?? undefined,
    });
  } catch (err: any) {
    console.error("CREATE ORDER ERROR:", err);

    if (err?.name === "ValidationError" || err?.name === "CastError") {
      return res.status(400).json({
        name: err.name,
        message: err.message,
        errors: err.errors,
        value: err.value,
        path: err.path,
      });
    }

    return res.status(500).json({
      message: "Couldn't create order",
      error: err?.message ?? String(err),
    });
  } finally {
    session.endSession();
  }
});

router.get("/orders/me", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const orders = await OrderModel.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .lean();
  console.log("DB first item:", orders?.[0]?.items?.[0]);
  
  res.json(orders);
});


router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrderModel.findById(id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    const authedUserId = req.user?.id;

    // 1) Inloggad ägare?
    if (order.userId && authedUserId && String(order.userId) === String(authedUserId)) {
      return res.json(order);
    }

    // 2) Gäst med token?
    const guestToken = req.header("x-guest-token");
    if (order.guestTokenHash && guestToken) {
      const incomingHash = hashToken(guestToken);
      if (incomingHash === order.guestTokenHash) {
        return res.json(order);
      }
    }

    console.log("[GET /orders/:id] Forbidden", {
      authedUserId,
      orderUserId: order.userId ? String(order.userId) : null,
      hasGuestTokenHeader: Boolean(guestToken),
      hasGuestTokenHashOnOrder: Boolean(order.guestTokenHash),
    });

    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    return res.status(500).json({ message: "Couldn't get order" });
  }
});

export default router;

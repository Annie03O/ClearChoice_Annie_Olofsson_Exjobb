import { OrderModel } from "../models/schemas/orderSchema";
import { makeOrderId } from "./makeOrdeId";

export const createUniqueOrderId = async (payload: any, session: any) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await OrderModel.create([payload], { session });
    } catch (err: any) {
      if (err?.code === 11000 && err?.keyPattern?.orderNumber) {
        payload.orderNumber = makeOrderId();
        continue;
      }
      throw err;
    }
  }
  throw new Error("Couldn't generate a unique order number.");
};

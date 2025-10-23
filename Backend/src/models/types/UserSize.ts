import { Types } from "mongoose";

export interface IUserSizes extends Document {
  userId: Types.ObjectId;
  shoulderSize: number;
  chestSize: number;
  waistSize: number;
  createdAt: Date;
  updatedAt: Date;
}

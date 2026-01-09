import { Types } from "mongoose";

export type SaveUserSizeInput = {
    userId: string | Types.ObjectId;
    shoulderSize: number;
    chestSize: number;
    waistSize: number;
}
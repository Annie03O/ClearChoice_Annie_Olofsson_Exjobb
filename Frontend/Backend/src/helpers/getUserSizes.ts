import { Types } from "mongoose";
import { UserSizes } from "../models/schemas/sizeSchema";
import { IUserSizes } from "../models/types/UserSize";

export const getUserSizes = (userId: string | Types.ObjectId) => {
    const userObjectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    return UserSizes.findOne({userId: userObjectId}).lean<IUserSizes>();
}
import { Types } from "mongoose"
import { SaveUserSizeInput } from "../models/types/SaveUserSizesInput"
import { UserSizes } from "../models/schemas/sizeSchema";
import { IUserSizes } from "../models/types/UserSize";

export const saveUserSizes = async (input: SaveUserSizeInput) => {
    const userObjectId = typeof input.userId === "string" ? new Types.ObjectId(input.userId) : input.userId;

    const doc = await UserSizes.findOneAndUpdate(
        {userId: userObjectId},
        {
            $set: {
                shoulderSize: input.shoulderSize,
                chestSize: input.chestSize,
                waistSize: input.waistSize
            },
        },
        {upsert: true, new: true, setDefaultsOnInsert: true}
    ).lean<IUserSizes>();

    return doc;
}
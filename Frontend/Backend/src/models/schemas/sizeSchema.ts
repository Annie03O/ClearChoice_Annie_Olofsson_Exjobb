import { model, Schema } from "mongoose";
import { IUserSizes } from "../types/UserSize";

export const userSizeSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true},
    shoulderSize: {type: Number, required: true},
    chestSize: {type: Number, required: true},
    waistSize: {type: Number, required: true},
},
{timestamps: true}
);

export const UserSizes = model<IUserSizes>("UserSizes", userSizeSchema)
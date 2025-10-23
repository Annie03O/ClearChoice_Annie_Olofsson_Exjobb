import type { Size } from "../models/Types/sizeCalculator/Size.";
import type { Category } from "../models/Types/sizeCalculator/Category";

export function toCategory(s: Size): Category {
    return {
        shoulder: s?.shoulderSize,
        chest: s?.chestSize,
        waist: s?.waistSize
    }
}

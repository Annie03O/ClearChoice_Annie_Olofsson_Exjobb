import crypto from "crypto";

export const makeOrderId = () => {
    const code = crypto.randomBytes(5).toString("hex").slice(0,8).toUpperCase();
    return `CC-${code}`
}
export function isValidSizePayload(body: any): body is {
    shoulderSize: number;
    chestSize: number;
    waistSize: number;
} {
    return (
        typeof body === "object" &&  body !== null &&
        typeof body.shoulderSize === "number" &&
        typeof body.chestSize === "number" &&
        typeof body.waistSize === "number" &&
        body.shoulderSize > 0 && body.chestSize > 0 && body.waistSize > 0
    )
}
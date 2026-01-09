import "express";
import { JwtUserPayload } from "./JwtPayload";

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtUserPayload;
    }
}
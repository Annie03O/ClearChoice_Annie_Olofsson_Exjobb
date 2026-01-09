// middleware/authOptional.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../models/types/JwtPayload";

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload;
}

export function authOptional(req: Request, _res: Response, next: NextFunction) {
  const access = req.cookies?.accessToken as string | undefined;
  if (access) {
    try {
      req.user = verifyToken(access);
    } catch {
      // ignorera bara
    }
  }
  next();
}

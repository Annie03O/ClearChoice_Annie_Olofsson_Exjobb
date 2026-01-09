import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../models/types/JwtPayload";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
} as const;

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const access = req.cookies?.accessToken as string | undefined;
  const refresh = req.cookies?.refreshToken as string | undefined;

  // 1) Har vi en access-token och den funkar? Kör vidare.
  if (access) {
    try {
      req.user = verifyToken(access);
      return next();
    } catch {
      // fall through till refresh-försök
    }
  }

  // 2) Om access saknas/är ogiltig, försök skapa ny från refresh.
  if (!refresh) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const payload = verifyToken(refresh); // använder samma JWT_SECRET i din kod
    const newAccess = jwt.sign(
      { id: payload.id, email: payload.email },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    );

    res.cookie("accessToken", newAccess, cookieOptions);
    req.user = { id: payload.id, email: payload.email, name: payload.name };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

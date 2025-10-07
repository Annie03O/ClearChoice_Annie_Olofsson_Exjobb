import { Request, Response, NextFunction} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./env";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const cookieToken = req.cookies?.token as string | undefined;

    let headerToken: string | undefined;

    const auth = req.headers.authorization;

    if (auth?.startsWith('Bearer ')) {
        headerToken = auth.slice("Bearer ".length);
    }

    const token = cookieToken ?? headerToken;

    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);

        const payload = typeof decoded === "string" ? undefined : (decoded as JwtPayload);

        if (!payload?.id || typeof payload.id !== "string") {
            return res.status(401).json({ error: "Invalid token payload" });
        }

        req.userId = payload.id;
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
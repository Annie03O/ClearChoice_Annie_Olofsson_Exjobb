import type { Request, Response } from "express";
import { Router } from "express";
import { User } from "../models/schemas/userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../middlewares/env";
import { cookieOpts } from "../models/objects/cookieOpts";
import { requireAuth } from "../middlewares/Auth";
import { products } from "../models/objects/products";
import { searchHandler } from "../helpers/searchHandler";
import { tshirtSizesF } from "../models/objects/sizeCalculator/tshirtSizesF";
import { tshirtSizesM } from "../models/objects/sizeCalculator/tshirtsSizesM";
import { oversizedFit } from "../models/objects/sizeCalculator/oversizedFit";
import { UserSizes } from "../models/schemas/sizeSchema";
import { saveUserSizes } from "../helpers/saveUserSizes";

console.log("[auth.ts] router loaded");

const router = Router();

// REGISTER
router.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: hash,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET as string, { expiresIn: "7d" });
    res.cookie("token", token, cookieOpts as any);
    res.json({ user: { id: String(user._id), name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET as string, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 7*24*60*60*1000
    });
    res.json({ user: { id: String(user._id), name: user.name, email: user.email } });
    res.status(200).json({ok: true}); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// ME
router.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select("_id name email");
  res.json({ user });
});

// LOGOUT
router.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token", cookieOpts as object);
  res.json({ ok: true });
});

//SEARCH
router.get("/api/search", searchHandler)


export default router;


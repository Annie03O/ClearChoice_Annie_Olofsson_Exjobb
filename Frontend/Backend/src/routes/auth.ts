import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middlewares/Auth";
import { User } from "../models/schemas/userSchema";
import path from "path";
import bcrypt from "bcryptjs";
import { JwtUserPayload } from "../models/types/JwtPayload";
import { updateMe } from "../controllers/authController";

const router = Router();

function makeAccessToken(user: { id: string; email: string }) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "10m" });
}

function makeRefreshToken(user: { id: string; email: string }) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: true, // Always true since we're using HTTPS (GitHub Pages to localhost requires this)
  sameSite: "none" as const, // Required for cross-origin cookies
  path: "/",
} as const;

// Middleware to prevent caching on auth routes
router.use((req: Request, res: Response, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  });
  next();
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { 
    email?: string;
    password?: string;
  }; 
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const userDoc = await User.findOne({ email: email.toLowerCase() }).exec();

    if (!userDoc) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, userDoc.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { id: userDoc._id.toString(), email: userDoc.email };
    const access = makeAccessToken(payload);
    const refresh = makeRefreshToken(payload);

    console.log("Login attempt:", email);


    res.cookie("accessToken", access, cookieOptions);
    
    res.cookie("refreshToken", refresh, cookieOptions);

    const user = { 
      id: userDoc._id.toString(), 
      email: userDoc.email, 
      name: userDoc.name 
    };
  
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };
    
    // For now, just accept any registration and log them in
    // In production, you'd validate input, check if user exists, hash password, save to DB
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password required" });
    }
  
    const existing = await User.findOne({ email: email.toLowerCase() }).exec();
    
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user (in-memory for demo)
    const userDoc = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });
    
    const payload = { id: userDoc._id.toString(), email: userDoc.email };
    const accessToken = makeAccessToken(payload);
    const refreshToken = makeRefreshToken(payload);
  
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    const user = {  
      id: userDoc._id.toString(), 
      email: userDoc.email, 
      name: userDoc.name 
    };
  
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/refresh", (req, res) => {
  const rt = req.cookies?.refreshToken as string | undefined;
  if (!rt) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(rt, process.env.JWT_SECRET!) as { id: string; email: string };

    const newAccess = makeAccessToken(payload);
    const newRefresh = makeRefreshToken(payload); // rotation

    res.cookie("accessToken", newAccess, cookieOptions);
    res.cookie("refreshToken", newRefresh, cookieOptions);

    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});


router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtUserPayload;
    // Fetch full user data from database to get name
    const userDoc = await User.findById(user.id).exec();
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ 
      id: userDoc._id.toString(), 
      email: userDoc.email, 
      name: userDoc.name 
    });
  } catch (err) {
    console.error("[/me] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.put("/me", requireAuth, updateMe)

router.post("/logout", (_req, res) => {
  res.clearCookie("accessToken", { 
    path: "/", 
    sameSite: cookieOptions.sameSite, 
    secure: cookieOptions.secure 
   }
 );
  res.clearCookie("refreshToken", { 
    path: "/", 
    sameSite: cookieOptions.sameSite, 
    secure: cookieOptions.secure 
   }
  );
  res.json({ ok: true });
});



router.post("/saveSize", requireAuth, async (req: Request, res: Response) => {
  // Här kan du läsa ut användaren
  const user = req.user as { id: string; email: string };

  // Här kan du läsa ut storleksdata från frontend
  const { sizeProfile } = req.body as {
    sizeProfile?: {
      chest?: number;
      waist?: number;
      hips?: number;
      // osv...
    };
  };

  // TODO: spara sizeProfile i databasen kopplad till user.id
  // t.ex. i User-modellen eller i en separat Size-model

  console.log("[saveSize] for user", user.email, "data:", sizeProfile);

  return res.json({
    ok: true,
    message: "Size profile saved (stub).",
    sizeProfile: sizeProfile ?? null,
  });
});


export default router;
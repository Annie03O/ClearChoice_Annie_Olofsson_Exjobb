import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth";
import orderRouter from "./routes/Order";
import { searchRouter } from "./routes/search";
import { verifyToken } from "./middlewares/authOptional";

dotenv.config();

const app = express();

// Viktigt på Render/Fly/NGINX (secure cookies + req.ip m.m.)
app.set("trust proxy", 1);

const allowedOrigins = (
  process.env.CLIENT_ORIGINS ??
  "http://localhost:5173,http://localhost:4000,https://annie03o.github.io"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // origin kan vara undefined (t.ex. curl/postman/same-origin)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

// ✅ Du kan ta bort app.options("*", ...) helt.
// cors-middleware hanterar preflight.

// Body + cookies
app.use(cookieParser());
app.use(express.json());

// debug
app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.url, "origin:", req.headers.origin);
  next();
});

// authOptional globalt (som du kör nu)
app.use((req: any, _res, next) => {
  const token = req.cookies?.accessToken;
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = { id: payload.id, email: payload.email, name: payload.name };
    } catch {}
  }
  next();
});

app.get("/health", (_req, res) => res.status(200).send("ok-clearchoice"));

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRouter);
app.use("/api", orderRouter);

app.use("/static", express.static(path.join(process.cwd(), "src/Merch")));

// 404 sist
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

const PORT = Number(process.env.PORT) || 4000;

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB error", err);
    process.exit(1);
  });

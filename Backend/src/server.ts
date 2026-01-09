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
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.url, "origin:", req.headers.origin);
  next();
});

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
app.get("/", (_req, res) => res.status(200).send("ClearChoice API is running"));

app.get("/health", (_req, res) => res.status(200).send("ok-clearchoice"));

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRouter);
app.use("/api", orderRouter);

app.use("/static", express.static(path.join(process.cwd(), "src/Merch")));
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

const PORT = Number(process.env.PORT) || 8080;

// ✅ Starta servern DIREKT så Railway kan nå den
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on ${PORT}`);
});


// ✅ Koppla DB separat (och logga fel)
const mongoUrl = process.env.MONGO_URL;
console.log("MONGO_URL set?", Boolean(mongoUrl));
console.log("MONGO_URL prefix:", mongoUrl?.slice(0, 20));

if (!mongoUrl) {
  console.error("Missing MONGO_URL env var");
} else {
  mongoose
    .connect(mongoUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB error", err));
}

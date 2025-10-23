import express, { NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import { saveSizeRouter } from "./routes/saveSize";
import { requireAuth } from "./middlewares/Auth";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Montera routern
app.use(authRouter);

app.use("/api/auth", requireAuth, saveSizeRouter)

console.log("[server] auth router mounted under /api/auth");

app.post("/api/auth/login", (_req, res) => {
  return res.json({ debug: "server.ts direct route hit" });
});


const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    const xfProto = (req.headers['x-forwarded-proto'] as string) || '';
    if (xfProto !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}  

app.use("/api/auth", saveSizeRouter);

// 404-fångare
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// DB & start
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB error", err);
    process.exit(1);
  });

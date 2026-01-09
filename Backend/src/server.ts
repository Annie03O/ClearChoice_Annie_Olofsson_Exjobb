import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import orderRouter from "./routes/Order";
import { searchRouter } from "./routes/search";
import { verifyToken } from "./middlewares/authOptional";
import path from "path";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.options("*", cors({ origin: "http://localhost:5173", credentials: true }));

app.use(cookieParser());
app.use(express.json());

// (valfritt) debug: se att requests kommer in
app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.url);
  next();
});

// authOptional “globalt” (som du kör nu)
app.use((req: any, _res, next) => {
  const token = req.cookies?.accessToken; // se till att cookie heter exakt så
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = { id: payload.id, email: payload.email, name: payload.name };
    } catch {}
  }
  next();
});

// lägg health TIDIGT så du kan testa enkelt
app.get("/health", (_req, res) => res.status(200).send("ok-clearchoice"));

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRouter);
app.use("/api", orderRouter);
app.use("/static", express.static(path.join(process.cwd(), "src/Merch")))
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

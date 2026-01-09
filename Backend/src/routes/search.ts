import { Router } from "express";
import { Product } from "../models/types/Product";
import { products } from "../models/objects/products";
export const searchRouter = Router();

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

searchRouter.get("/", (req, res) => {
  const q = String(req.query.query ?? "").trim();
  const limit = Math.min(Number(req.query.limit ?? 8), 50);

  if (!q) return res.status(200).json([] satisfies Product[]);

  const nq = norm(q);

  const hits = products
    .filter((p) => {
      const hay = norm(
        [p.label, p.fandom, p.description].filter(Boolean).join(" ")
      );
      return hay.includes(nq);
    })
    .slice(0, limit);

  return res.status(200).json(hits);
});

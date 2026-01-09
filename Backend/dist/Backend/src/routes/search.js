"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRouter = void 0;
const express_1 = require("express");
const products_1 = require("../models/objects/products");
exports.searchRouter = (0, express_1.Router)();
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
exports.searchRouter.get("/", (req, res) => {
    const q = String(req.query.query ?? "").trim();
    const limit = Math.min(Number(req.query.limit ?? 8), 50);
    if (!q)
        return res.status(200).json([]);
    const nq = norm(q);
    const hits = products_1.products
        .filter((p) => {
        const hay = norm([p.label, p.fandom, p.description].filter(Boolean).join(" "));
        return hay.includes(nq);
    })
        .slice(0, limit);
    return res.status(200).json(hits);
});

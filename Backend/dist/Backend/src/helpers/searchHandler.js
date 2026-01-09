"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHandler = void 0;
const products_1 = require("../models/objects/products");
const searchHandler = (req, res) => {
    try {
        const raw = (req.query.query ?? "").toString();
        const q = raw.trim().toLowerCase();
        if (!q || q.length < 1) {
            return res.status(200).json([]);
        }
        const list = Array.isArray(products_1.products) ? products_1.products : [];
        const results = list.filter((p) => {
            const label = (p?.label ?? "").toString().toLowerCase();
            return label.includes(q);
        }).slice(0, 20);
        return res.status(200).json(results);
    }
    catch (err) {
        console.error("Search Error:", err);
        return res.status(500).json({ error: "Internal Search Error" });
    }
};
exports.searchHandler = searchHandler;

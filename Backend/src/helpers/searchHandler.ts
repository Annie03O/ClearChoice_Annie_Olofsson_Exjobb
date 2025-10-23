import { products } from "../models/objects/products";
import { Request, Response } from "express";
import { Product } from "../models/types/Product";

export const searchHandler = (req: Request, res: Response) => {
    try {
        const raw = (req.query.query ?? "").toString();
        const q = raw.trim().toLowerCase();

        if (!q || q.length < 1) {
            return res.status(200).json([]);
        }  

        const list: Product[] = Array.isArray(products) ? products : [];

        const results = list.filter((p) => {
            const label = (p?.label ?? "").toString().toLowerCase();
            return label.includes(q);
        }).slice(0, 20);

        return res.status(200).json(results);
    } catch (err: any) {
        console.error("Search Error:", err);
        return res.status(500).json({error: "Internal Search Error"})
        
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const Order_1 = __importDefault(require("./routes/Order"));
const search_1 = require("./routes/search");
const authOptional_1 = require("./middlewares/authOptional");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Viktigt på Render/Fly/NGINX (secure cookies + req.ip m.m.)
app.set("trust proxy", 1);
const allowedOrigins = (process.env.CLIENT_ORIGINS ??
    "http://localhost:5173,http://localhost:4000,https://annie03o.github.io")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        // origin kan vara undefined (t.ex. curl/postman/same-origin)
        if (!origin)
            return cb(null, true);
        if (allowedOrigins.includes(origin))
            return cb(null, true);
        return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
}));
// ✅ Du kan ta bort app.options("*", ...) helt.
// cors-middleware hanterar preflight.
// Body + cookies
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// debug
app.use((req, _res, next) => {
    console.log("[REQ]", req.method, req.url, "origin:", req.headers.origin);
    next();
});
// authOptional globalt (som du kör nu)
app.use((req, _res, next) => {
    const token = req.cookies?.accessToken;
    if (token) {
        try {
            const payload = (0, authOptional_1.verifyToken)(token);
            req.user = { id: payload.id, email: payload.email, name: payload.name };
        }
        catch { }
    }
    next();
});
app.get("/health", (_req, res) => res.status(200).send("ok-clearchoice"));
app.use("/api/auth", auth_1.default);
app.use("/api/search", search_1.searchRouter);
app.use("/api", Order_1.default);
app.use("/static", express_1.default.static(path_1.default.join(process.cwd(), "src/Merch")));
// 404 sist
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
const PORT = Number(process.env.PORT) || 4000;
mongoose_1.default
    .connect(process.env.MONGO_URL)
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
})
    .catch((err) => {
    console.error("MongoDB error", err);
    process.exit(1);
});

import { cookieOpts } from "../models/cookieOpts";
import { app } from "../server";

app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token", cookieOpts as object);
    res.json({ ok: true });
})
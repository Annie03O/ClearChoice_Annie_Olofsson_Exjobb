import { requireAuth } from "../middlewares/Auth";
import { User } from "../models/userSchema";
import { app } from "../server";

app.get("/api/auth/me", requireAuth, async (req, res) => {
    const user = await User.findById(req.userId).select("_id name email");
    res.json({ user });
})
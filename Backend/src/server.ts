import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
export const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("MongoDB error", err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
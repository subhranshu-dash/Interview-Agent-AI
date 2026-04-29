import dotenv from "dotenv";
dotenv.config(); // ← Sabse pehle

import express from "express";
import { connectDb } from "./config/dbconnect.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route.js";
import cors from "cors";
import { userRouter } from "./routes/user.router.js";
import { interviewRouter } from "./routes/interview.route.js";
import paymentRoute from "./routes/payment.route.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRoute); // ✅

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

connectDb();
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { isAuth } from "../midlleware/isAuth.js";

const router = express.Router();

// ✅ Razorpay instance function ke andar banao, bahar nahi
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Order Create
router.post("/create-order", isAuth, async (req, res) => {
  try {
    const { amount, planName } = req.body;

    const razorpay = getRazorpay(); // ← Yahan banao

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${planName}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// Payment Verify
router.post("/verify", isAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await User.findByIdAndUpdate(req.userId, {
        plan: planName,
        planActivatedAt: new Date(),
      });

      res.json({ success: true, message: "Payment verified", plan: planName });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
});

export default router;
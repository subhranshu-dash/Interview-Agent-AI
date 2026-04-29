import express from "express"
import { isAuth } from "../midlleware/isAuth.js"
import { getCurrentuser } from "../controller/user.controller.js"

const userRouter = express.Router()

userRouter.get("/current-user", isAuth, getCurrentuser)
userRouter.get("/profile", isAuth, async (req, res) => {  // ← New route add kiya
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export { userRouter }
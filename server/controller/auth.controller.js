import { genToken } from "../config/token.js"
import { User } from "../models/user.model.js"

// user authentication
export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email
      })
    }

    const token = await genToken(user._id)

    // ✅ FIXED COOKIE SETTINGS
    res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

    return res.status(200).json({
      message: "Login successful",
      user
    })

  } catch (error) {
    console.log("Google Auth Error:", error)
    return res.status(500).json({ message: "Google auth error" })
  }
}


// logout authentication
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
  httpOnly: true,
  sameSite: "lax",
  secure: false
   })  

    return res.status(200).json({ message: "Logout successfully" })

  } catch (error) {
    console.log("Logout Error:", error)
    return res.status(500).json({ message: "Logout error" }) // 🔥 FIXED json typo
  }
}
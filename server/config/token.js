import jwt from "jsonwebtoken"

const genToken = (userId) => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,   // ✅ FIXED
      { expiresIn: "7d" }
    )

    return token   // 🔥 MOST IMPORTANT FIX

  } catch (error) {
    console.log("Token Error:", error)
  }
}

export { genToken }
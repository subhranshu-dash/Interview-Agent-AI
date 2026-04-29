import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
  try {

    // 🔥 FIX: correct cookie name
    const token = req.cookies.accessToken

    // console.log("TOKEN VALUE:", token)
    // console.log("TYPE:", typeof token)

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = verifyToken.userId

    next()

  } catch (error) {
    console.log("Auth Error:", error)
    return res.status(401).json({ message: "Invalid token" })
  }
}

export { isAuth }
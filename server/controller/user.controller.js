import { User } from "../models/user.model.js"

export const getCurrentuser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = await User.findById(req.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json(user)

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Failed to get current user" })
  }
}
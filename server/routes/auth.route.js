import { googleAuth, logout } from "../controller/auth.controller.js"
import express from "express"

const authRouter = express.Router()

authRouter.post("/google" ,googleAuth)
authRouter.get("/logout" ,logout)

export {authRouter}
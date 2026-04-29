
import express from "express"
import { isAuth } from "../midlleware/isAuth.js"
import { upload } from "../midlleware/multer.js"
import { analyseResume, finishInterview, generatequestion, submitAnswer,getmyInterviews,getInterviewReport } from "../controller/interviewcontroller.js"


const interviewRouter = express.Router()

interviewRouter.post("/resume",isAuth,upload.single("resume"),
analyseResume)

interviewRouter.post("/generate-question" ,isAuth,generatequestion)
interviewRouter.post("/submit-answer",isAuth,submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)
interviewRouter.get("/get-interview" ,isAuth,getmyInterviews)
interviewRouter.get("/report/:id" ,isAuth,getInterviewReport)


export {interviewRouter}
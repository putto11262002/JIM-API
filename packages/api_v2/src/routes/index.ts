import express from "express"
import modelApplicationRouter from "./model-application-router"
import modelRouter from "./model-router"
import staffRouter from "./staff-router"
import jobRouter from "./job"
import caledarRouter from "./calendar"
const router = express.Router()

router.use("/model-applications", modelApplicationRouter)

router.use("/models", modelRouter)

router.use("/staffs", staffRouter)

router.use(caledarRouter)

router.use(jobRouter)


export default router
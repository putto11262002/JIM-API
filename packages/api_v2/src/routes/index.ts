import express from "express"
import modelApplicationRouter from "./model-application-router"
import modelRouter from "./model-router"
import staffRouter from "./staff-router"
const router = express.Router()

router.use("/model-applications", modelApplicationRouter)

router.use("/models", modelRouter)

router.use("/staffs", staffRouter)


export default router
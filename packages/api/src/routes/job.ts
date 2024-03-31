import express from "express"
import jobController from "../controllers/job"
import { staffAuthMiddleware } from "../middlewares/staff-auth-middleware"

const jobRouter = express.Router()

jobRouter.post("/jobs", staffAuthMiddleware(),jobController.create)

jobRouter.get("/jobs", staffAuthMiddleware(), jobController.getAll)

jobRouter.get("/jobs/:id", staffAuthMiddleware(), jobController.getById)

jobRouter.put("/jobs/:id", staffAuthMiddleware(), jobController.updateById)

jobRouter.post("/jobs/:id/models", staffAuthMiddleware(), jobController.addModel)  

jobRouter.delete("/jobs/:id/models/:modelId", staffAuthMiddleware(), jobController.removeModel)

jobRouter.post("/jobs/:id/bookings", staffAuthMiddleware(), jobController.addBooking)

jobRouter.delete("/jobs/bookings/:bookingId", staffAuthMiddleware(), jobController.removeBooking)

jobRouter.get("/models/:modelId/jobs", staffAuthMiddleware(), jobController.getModelJobs)

export default jobRouter
import express from "express"
const bookingRouter = express.Router()
import bookingController from "../controllers/booking-controller"
import { staffAuthMiddleware } from "../middlewares/staff-auth-middleware"


const bookingRoutePrefix = "/booking"

bookingRouter.post(bookingRoutePrefix, staffAuthMiddleware(),bookingController.create)

bookingRouter.get(bookingRoutePrefix, staffAuthMiddleware(),bookingController.getAll)

bookingRouter.get(bookingRoutePrefix + "/:id", staffAuthMiddleware(),bookingController.getById)

bookingRouter.put(bookingRoutePrefix + "/:id", staffAuthMiddleware(),bookingController.updateById)

bookingRouter.post(bookingRoutePrefix + "/:id/model", staffAuthMiddleware(), bookingController.addModel)

bookingRouter.delete(bookingRoutePrefix + "/:id/model/:modelId",staffAuthMiddleware(),bookingController.removeModel)

bookingRouter.post(bookingRoutePrefix + "/:id/cancel", staffAuthMiddleware(),bookingController.cancel)

bookingRouter.post(bookingRoutePrefix + "/:id/uncancel", staffAuthMiddleware(),bookingController.uncancel)

bookingRouter.post(bookingRoutePrefix + "/:id/confirm", staffAuthMiddleware(),bookingController.confirm)

bookingRouter.post(bookingRoutePrefix + "/:id/archive", staffAuthMiddleware(),bookingController.archive)

bookingRouter.post(bookingRoutePrefix + "/:id/unarchive", staffAuthMiddleware(),bookingController.unarchive)


export default bookingRouter;
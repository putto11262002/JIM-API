import express from "express"
import cookingController from "../controllers/calendar";
const caledarRouter = express.Router()

caledarRouter.get("/bookings/calendar", cookingController.getCalendar)

export default caledarRouter;
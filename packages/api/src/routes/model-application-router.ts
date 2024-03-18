import express from "express";
import {
  acceptModelApplicationController,
  addImageToModelApplicationController,
  archiveModelApplicationController,
  createModelApplicationController,
  getModelApplicationController,
  getModelApplicationsController,
} from "../controllers/model-application-controller";
import upload, { uploadMiddleware } from "../middlewares/upload";
import router from ".";
import { staffAuthMiddleware } from "../middlewares/staff-auth-middleware";
const modelApplicationRouter = express.Router();

modelApplicationRouter.post("/", createModelApplicationController);

modelApplicationRouter.post(
  "/:id/images",
  uploadMiddleware([{ name: "images", maxCount: 5 }], {
    allowedMimetype: ["image/png", "image/jpg", "image/jpeg"],
  }),
  addImageToModelApplicationController
);

modelApplicationRouter.get("/:id", getModelApplicationController);

modelApplicationRouter.post(
  "/:id/accept",
  staffAuthMiddleware(),
  acceptModelApplicationController
);

modelApplicationRouter.post(
  "/:id/archive",
  staffAuthMiddleware(),
  archiveModelApplicationController
);

modelApplicationRouter.get(
  "/",
  staffAuthMiddleware(),
  getModelApplicationsController
);

export default modelApplicationRouter;

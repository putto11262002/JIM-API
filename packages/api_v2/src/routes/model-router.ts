import express from "express";
import modelController from "../controllers/model-controller";
import upload from "../middlewares/upload";
import { staffAuthMiddleware } from "../middlewares/staff-auth-middleware";

const modelRouter = express.Router();

modelRouter.get("/", staffAuthMiddleware(), modelController.getModels);

modelRouter.get("/:id", modelController.getModel);

modelRouter.post("/", staffAuthMiddleware(),modelController.createModel);

modelRouter.put("/:id", modelController.updateModel);

modelRouter.post("/:id/experiences", modelController.addModelExperience);

modelRouter.delete(
  "/experiences/:experienceId",
  modelController.removeModelExperience
);

modelRouter.post(
  "/:id/images",
  upload.single("image"),
  modelController.addModelImage
);

modelRouter.delete("/images/:imageId", modelController.removeModelImage);

export default modelRouter;

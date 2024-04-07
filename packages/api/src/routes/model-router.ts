import express from "express";
import modelController from "../controllers/model-controller";
import {uploadMiddleware} from "../middlewares/upload";
import { staffAuthMiddleware } from "../middlewares/staff-auth-middleware";

const modelRouter = express.Router();

modelRouter.get("/", staffAuthMiddleware(), modelController.getModels);


modelRouter.get("/public", modelController.getPublicModels)

modelRouter.get("/public/:id", modelController.getPublicModelById)

modelRouter.get("/:id", staffAuthMiddleware(), modelController.getModel);

modelRouter.post("/", staffAuthMiddleware(),modelController.createModel);

modelRouter.put("/:id", modelController.updateModel);

modelRouter.post("/:id/experiences", modelController.addModelExperience);

modelRouter.delete(
  "/experiences/:experienceId",
  modelController.removeModelExperience
);

modelRouter.get("/:id/images", modelController.getModelImages);

modelRouter.delete("/images/:imageId", modelController.removeModelImage);


modelRouter.post(
	"/:id/images",
	uploadMiddleware([{name: "image", maxCount: 1}], {allowedMimetype: ["image/png", "image/jpg", "image/jpeg"]}),
	modelController.addModelImage
);

modelRouter.put("/images/:imageId/profile", modelController.setModelProfileImage)

export default modelRouter;

import express from "express";
import staffController from "../controllers/staff-controller";
import { staffAuthMiddleware } from "../middlewares/staff-auth-middleware";
import { StaffRole } from "../types/staff";

const staffRouter = express.Router();

staffRouter.post(
  "/",
  staffAuthMiddleware(StaffRole.STAFF_ADMIN, StaffRole.STAFF_ROOT),
  staffController.create
);

staffRouter.post("/login",staffController.login);

staffRouter.get("/", staffAuthMiddleware(StaffRole.STAFF_ADMIN, StaffRole.STAFF_ROOT),staffController.getAll);

staffRouter.get("/self", staffAuthMiddleware(),staffController.getSelf);

staffRouter.get("/:id", staffAuthMiddleware(StaffRole.STAFF_ADMIN, StaffRole.STAFF_ROOT),staffController.getById);

staffRouter.put("/self", staffAuthMiddleware(),staffController.updateSelf);

staffRouter.put("/:id", staffAuthMiddleware(StaffRole.STAFF_ADMIN, StaffRole.STAFF_ROOT),staffController.updateById);

staffRouter.put("/self/password", staffAuthMiddleware(),staffController.updateSelfPassword);

staffRouter.put("/:id/password", staffAuthMiddleware(StaffRole.STAFF_ROOT),staffController.updatePasswordById);

staffRouter.post("/refresh-token", staffController.refreshToken);

staffRouter.post("/logout", staffAuthMiddleware(),staffController.logout);

export default staffRouter;

import { Router } from "express";
import { AdminController } from "../controllers";
import { authorize, hasPermission } from "../middlewares";

const router = Router();
const adminController = new AdminController();

router.get(
  "/view-users",
  authorize,
  hasPermission("view-users"),
  adminController.viewAllUsers
);
router.get(
  "/view-tasks",
  authorize,
  hasPermission("view-all-task"),
  adminController.viewAllTasks
);

export { router as adminRoute };

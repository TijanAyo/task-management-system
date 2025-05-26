import { Router } from "express";
import { TaskController } from "../controllers";
import { authorize, hasPermission, validate } from "../middlewares";
import { createTaskSchema, updateTaskSchema } from "../schemas";

const taskController = new TaskController();
const router = Router();

router.post(
  "/",
  authorize,
  hasPermission("create-task"),
  validate(createTaskSchema),
  taskController.create
);
router.get("/", authorize, hasPermission("view-task"), taskController.viewTask);
router.patch(
  "/:taskId",
  authorize,
  hasPermission("update-task"),
  validate(updateTaskSchema),
  taskController.updateTask
);
router.delete(
  "/:taskId",
  authorize,
  hasPermission("delete-task"),
  taskController.deleteTask
);

router.get(
  "/report-time",
  authorize,
  hasPermission("generate-time-report"),
  taskController.generateTimeReport
);
router.get(
  "/report",
  authorize,
  hasPermission("generate-completion-report"),
  taskController.generateCompletionReport
);

export { router as taskRoute };

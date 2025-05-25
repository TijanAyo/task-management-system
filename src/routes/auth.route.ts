import { Router } from "express";
import { AuthController } from "../controllers";
import { registerSchema, loginSchema } from "../schemas";
import { validate } from "../middleware";

const authController = new AuthController();

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

export { router as authRoute };

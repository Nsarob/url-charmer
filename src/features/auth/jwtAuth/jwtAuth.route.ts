import { Router } from "express";
import { emailOrUsernameAndPasswordAuth, registerUserAuth, refreshAccessToken } from "./jwtAuth.controller";
import validate from "../../../shared/middleware/validator";
import { loginSchema, registerSchema } from "./jwtAuth.types";

const router = Router();

router.post("/register", validate(registerSchema), registerUserAuth);
router.post("/login", validate(loginSchema), emailOrUsernameAndPasswordAuth);
router.post("/refresh-token", refreshAccessToken);

export default router;
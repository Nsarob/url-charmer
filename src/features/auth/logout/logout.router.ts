import { Router } from "express";

import logoutController from "./logout.controller";

const router = Router();

router.post("/", logoutController.passportLogout);
router.get("/", logoutController.authLogout);

export { router as logoutRoutes };

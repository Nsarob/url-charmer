import { Router } from "express";

import googleAuthRoutes from "./googleAuth/googleAuth.route";
import jwtAuthRoutes from "./jwtAuth/jwtAuth.route";
import { logoutRoutes } from "./logout/logout.router";

const router = Router();


router.use("/", jwtAuthRoutes);
router.use("/google", googleAuthRoutes);
router.use("/logout", logoutRoutes);

export default router;

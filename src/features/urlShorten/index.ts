import { Router } from "express";

import ShortenURLRoutes from "./routes";

const router = Router();

router.use("/", ShortenURLRoutes);

export default router;

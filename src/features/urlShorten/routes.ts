/*
routes.ts
description: This file contains the routes for the users
author: damour nsanzimfura<blaiseniyonkuru12@gmail.com>
*/

import { Router } from "express";
import {
    shortenURLController,
    getAllURLsForUserController,
    getURLDetailsForUserController,
    updateShortURLController,
    userDashboardDataController,
    getShortCodeUrlLongUrlController
} from "./controllers";
import validate from "../../shared/middleware/validator";
import { shortenURLSchema } from "./types";
import { isUserLoggedIn } from "../../shared/middleware/verifyLogin";

const router = Router();

router.get("/l/:short_code", getShortCodeUrlLongUrlController);
router.get("/urls", isUserLoggedIn, getAllURLsForUserController);
router.post("/shorten", isUserLoggedIn, validate(shortenURLSchema), shortenURLController);
router.get("/analytics/:short_code",isUserLoggedIn, getURLDetailsForUserController);
router.patch("/:short_code",isUserLoggedIn, updateShortURLController);
router.get("/dashboard", isUserLoggedIn, userDashboardDataController);

export default router;
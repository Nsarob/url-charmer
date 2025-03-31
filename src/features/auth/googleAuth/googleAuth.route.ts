import { Router } from "express";
import { googleAuthCallback } from "./googleAuth.controller";
import { loginWithGoogle, authenticateWithGoogle } from "./googleAuth.utils";

const router = Router();

router.get("/test-login", (req, res) => {
  res.send("<a href='/auth/google/login'>Login with google</a>");
});

router.get("/login", loginWithGoogle);
router.get("/callback", authenticateWithGoogle, googleAuthCallback);

export default router;
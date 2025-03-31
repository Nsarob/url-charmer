import { Request, Response, NextFunction } from "express";

import googleAuthService from "./googleAuth.service";
import { buildRedirectUrl } from "./googleAuth.utils";
import { FRONTEND_URL } from "../../../config/basic";
import { createJWT } from "../../../utils/jwt";

const REDIRECT_URL = FRONTEND_URL + `/dashboard`;

export const googleAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = req.user;
    const response = googleAuthService.googleAuthCallback(user);
    const redirectUrl = buildRedirectUrl(response, REDIRECT_URL);

    const token = createJWT(user);

    const refreshToken = createJWT(user, "30d");

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.redirect(`${redirectUrl}?access_token=${token}`);
  }
  catch (error) {
    next(error);
  }
};

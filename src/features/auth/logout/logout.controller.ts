import { NextFunction, Request, Response } from "express";

import { FRONTEND_URL, NODE_ENV } from "../../../config/basic";

const LOGOUT_REDIRECT_URL = `${FRONTEND_URL}/login`;
const COOKIE_NAME = "connect.sid";
// const SESSION_COOKIE_SECURE = NODE_ENV === "prod";
// const SESSION_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

const passportLogout = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("logout user", req.user);

  try {
    //I had to include the user before the callback when calling the logout function
    req.logout({ keepSessionInfo: false }, function (err) {
      console.log("logout callback called");
      if (err) {
        console.log("error", err);
        return next(err);
      }
    });
  } catch (e) {
    console.log(e);
  }
  //added a response to the frontend with the result of an authentication check
  res.clearCookie(COOKIE_NAME);
  req.user = null;
  res.json(req.isAuthenticated());
};

const authLogout = (req: Request, res: Response, next: NextFunction): void => {

  // req.logout({ keepSessionInfo: false }, function (err) {
  //   if (err) {
  //     console.log("error", err);
  //     return next(err);
  //   }
  // });
  
  res.clearCookie(COOKIE_NAME);

  req.user = null;

  res.clearCookie('access_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.redirect(LOGOUT_REDIRECT_URL);
};

const isAuthenticated = (req: Request, res: Response): void => {
  res.json(req.isAuthenticated());
};

const logoutController = {
  passportLogout,
  isAuthenticated,
  authLogout,
};

export default logoutController;

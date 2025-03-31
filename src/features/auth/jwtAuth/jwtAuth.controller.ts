/*
filename: emailPasswordAuth.controller.ts
description: This file contains the controller for the email password authentication
author: damour nsanzimfura<blaiseniyonkuru12@gmail.com>
*/


import { Request, Response, NextFunction } from "express";

import { LoginBodyInput, RegisterBodyInput } from "./jwtAuth.types";
import { loginWithEmailOrUsernameAndPassword, registerUserWithEmailOrUsernameAndPassword } from "./jwtAuth.service";
import { createJWT, verifyJWT } from "../../../utils/jwt";
import User from "../../../database/models/user";



export const emailOrUsernameAndPasswordAuth = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    LoginBodyInput["body"]
  >,
  res: Response,
  next: NextFunction

) => {

  try {
    const { username, password } = req.body

    const user = await loginWithEmailOrUsernameAndPassword(username, password);

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

    res.status(200).json({ "status": "success", "message": "Login successful", "data": {
      access_token: token,
    } });

  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token using the refresh token in the cookies.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} A promise that resolves when the request is finished
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // Get the refresh token from the cookies
    const refreshToken = req.cookies.refresh_token;

    // If the refresh token is not valid, return an error
    if (!refreshToken) {
      res.status(401).json({
        status: "error",
        message: "Invalid refresh access token."
      });
      return;
    }

    // Verify the current access token
    const decoded = verifyJWT(refreshToken);

    // If the access token is not valid, return an error
    if (!decoded) {
      res.status(401).json({
        status: "error",
        message: "Invalid refresh access token."
      });
      return;
    }

    // Find the user from the database
    const user = await User.findOne({
      where: {
        id: decoded.id
      }
    });

    // If the user is not found, return an error
    if (!user) {
      res.status(401).json({
        status: "error",
        message: "User not found"
      });
      return;
    }

    // Generate a new access token using the user data
    const accessToken = createJWT(user);

    // Return the new access token
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        access_token: accessToken
      },
    });
  } catch (error) {

    next(error);
  }
};

export const registerUserAuth = async (req: Request<
  Record<string, never>,
  Record<string, never>,
  RegisterBodyInput["body"]
>, res: Response, next: NextFunction) => {

  try {

    await registerUserWithEmailOrUsernameAndPassword(req.body);

    res.status(201).json({
      status: "success",
      message: "User registered successfully"
    });

  } catch (error) {
    next(error);
  }
};

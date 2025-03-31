/*
controllers.ts
description: This file contains the controllers for the users
author: damour nsanzimfura<blaiseniyonkuru12@gmail.com>
*/


import { Request, Response, NextFunction } from "express";

import { ShortenURLBodyInput } from "./types";
import {
    shortenURL,
    getAllURLsForUser,
    getURLDetailsForUser,
    updateShortURL,
    getLongURLByShortCode,
    dashboardData
} from "./services";


export const shortenURLController = async (
    req: Request<
        Record<string, never>,
        Record<string, never>,
        ShortenURLBodyInput["body"]
    >,
    res: Response,
    next: NextFunction

) => {

    try {
        const shortenedURL = await shortenURL({
            title: req.body.title,
            url: req.body.url,
            user_id: req.user.id,
            short_code: req.body.short_code
        });

        res.status(200).json({ "status": "success", "message": "URL shortend successful", "data": shortenedURL });

    } catch (error) {
        next(error);
    }
};

// Controller to get all URLs for a user
export const getAllURLsForUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const urls = await getAllURLsForUser(req.user.id);
        res.status(200).json({ status: "success", message: "Fetched all URLs", data: urls });
    } catch (error) {
        next(error);
    }
};

// Controller to get all URLs for a user
export const userDashboardDataController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.user.id);
        const data = await dashboardData(req.user.id);
        res.status(200).json({ status: "success", message: "Fetched all URLs", data: data });
    } catch (error) {
        next(error);
    }
};

// Controller to get URL details for a specific short_code for a user
export const getURLDetailsForUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { short_code } = req.params;
        const urlDetails = await getURLDetailsForUser(req.user.id, short_code);
        res.status(200).json({ status: "success", message: "URL details found", data: urlDetails });
    } catch (error) {
        next(error);
    }
};

// Controller to get URL details for a specific short_code for a user
export const getShortCodeUrlLongUrlController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { short_code } = req.params;
        const longUrl = await getLongURLByShortCode(short_code);
        res.redirect(longUrl);
    } catch (error) {
        next(error);
    }
};

// Controller to update a shortened URL for a user
export const updateShortURLController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { short_code } = req.params;
        const updateData = req.body;
        const updatedURL = await updateShortURL(req.user.id, short_code, updateData);
        res.status(200).json({ status: "success", message: "URL updated successfully", data: updatedURL });
    } catch (error) {
        next(error);
    }
};

/*
servoces.ts
description: This file contains the services to handle business logic for the users
author: damour nsanzimfura<blaiseniyonkuru12@gmail.com>
*/


import User from "../../database/models/user";
import URL from "../../database/models/url";
import crypto from 'crypto';
import { NotFoundError } from "../../utils/errors";
import connection from "../../database/connection";

export interface URLInput {
    title?: string;
    url: string;
    shortened_url?: string;
    short_code?: string;
    user_id: number;
}

const generateShortCode = (): string => {
    return crypto.randomBytes(4).toString('hex');
};

export const shortenURL = async (data: URLInput) => {
    const shortCode = data.short_code ? data.short_code : generateShortCode();
    try {
        const newURL = await URL.create({
            user_id: data.user_id,
            short_code: shortCode,
            long_url: data.url,
            title: data.title ? data.title : '',
        });
        return newURL;
    } catch (error) {
        throw new Error('Error creating shortened URL');
    }
};

// Get all URLs for a user
export const getAllURLsForUser = async (userId: number) => {
    try {

        console.log("userId 111", userId);
        const urls = (await URL.findAll({ where: { user_id: userId } })).map((url) => {
            return { ...url.dataValues, shortened_url: `${process.env.APP_URL}/${url.short_code}` };
        });
        console.log("urls", urls);
        return urls;
    } catch (error) {
        console.log("Biranze peee>>>>>")
        throw new Error('Error fetching URLs hhh for user');
    }
};


export const getLongURLByShortCode = async (shortCode: string) => {
    try {
        console.log("shortCode", shortCode);
        const url = await URL.findOne({ where: { short_code: shortCode } });
        if (!url) {
            throw new NotFoundError('Eheehh URL not found')
        }
        const update = await url.update({ clicks: (url.clicks || 0) + 1 });
        return url.dataValues.long_url;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching URL');
    }
};

// Get details for a given shortened code for a user
export const getURLDetailsForUser = async (userId: number, shortCode: string) => {
    try {
        const urlDetails = await URL.findOne({ where: { user_id: userId, short_code: shortCode } });
        if (!urlDetails) {
            throw new NotFoundError('URL not found for the user');
        }
        return urlDetails;
    } catch (error) {
        throw new Error('Error fetching URL details');
    }
};

// Update a shortened URL for a user
export const updateShortURL = async (
    userId: number,
    shortCode: string,
    updateData: { title?: string; url?: string }
) => {
    try {
        const urlRecord = await URL.findOne({ where: { user_id: userId, short_code: shortCode } });
        if (!urlRecord) {
            throw new NotFoundError('URL not found for the given user');
        }
        await urlRecord.update(updateData);
        return urlRecord;
    } catch (error) {
        throw new Error('Error updating shortened URL');
    }
};


export const dashboardData = async (userId: number) => {
    try {
        // Use subqueries to get both user data and aggregated URL stats in one query
        const user: any = await User.findOne({
            where: { id: userId },
            attributes: [
                'id',
                'username',
                [
                    connection.literal(`(
                        SELECT COUNT(*)
                        FROM "URLs"
                        WHERE "URLs"."user_id" = "User"."id"
                    )`),
                    'totalLinks'
                ],
                [
                    connection.literal(`(
                        SELECT COALESCE(SUM("clicks"), 0)
                        FROM "URLs"
                        WHERE "URLs"."user_id" = "User"."id"
                    )`),
                    'totalClicks'
                ],
                [
                    connection.literal(`(
                        SELECT COALESCE(AVG("clicks"), 0)
                        FROM "URLs"
                        WHERE "URLs"."user_id" = "User"."id"
                    )`),
                    'averageClicksPerLink'
                ]
            ],
            include: [{
                model: URL,
                as: 'URLs',
                attributes: ['id', 'title', 'long_url', 'short_code', 'clicks', 'createdAt'],
                required: false, // Use LEFT JOIN to return user even if no URLs exist
                limit: 3,
                order: [['createdAt', 'DESC']]
            }],
            raw: false
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Convert to plain object
        const plainUser = user.get({ plain: true });

        // Extract and format latest URLs
        const latestURLs = (plainUser.URLs || []).map((url: any) => ({
            id: url.id,
            title: url.title,
            long_url: url.long_url,
            short_code: url.short_code,
            clicks: url.clicks,
            createdAt: url.createdAt
        }));

        return {
            username: plainUser.username,
            totalLinks: parseInt(plainUser.totalLinks, 10) || 0,
            totalClicks: parseInt(plainUser.totalClicks, 10) || 0,
            averageClicksPerLink: parseFloat(plainUser.averageClicksPerLink) || 0,
            latestURLs
        };

    } catch (error) {
        console.error(error);
        throw new Error('Error fetching dashboard data');
    }
};
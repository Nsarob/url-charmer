import e, { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../../utils/errors";
import { verifyJWT, DecodedJWT } from "../../utils/jwt";
import User from "../../database/models/user"; // Adjust the import based on your project structure

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if ((req as any).isAuthenticated()) {
        console.log("user is authenticated", (req as any).user)
        return next();
    } else {
        throw new NotAuthorizedError();
    }
}


export const isUserLoggedIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    console.log("Checking if user is logged in");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new NotAuthorizedError();
    }

    const token = authHeader.split(" ")[1];

    console.log("Token", token);
    try {
        const decoded: DecodedJWT = verifyJWT(token);
        console.log("Decoded", decoded);
        const user = await User.findByPk(decoded.id);

        // console.log("User", user);
        if (!user) {
            console.log("User not found");
            throw new NotAuthorizedError();
        }

        (req as any).user = user;
        console.log("User found", user);
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
};
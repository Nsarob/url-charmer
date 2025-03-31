import { Express } from "express";
import passport, { Strategy } from "passport";

import User from "../../database/models/user";

export const initializePassport = (_app: Express): void => {
    _app.use(passport.initialize());
    _app.use(passport.session());
    _app.use(passport.authenticate("session"));
    
    return;
}

export const useStrategy = (strategy: Strategy): void => {
    passport.use(strategy);

    passport.serializeUser((user: User, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    return;
};
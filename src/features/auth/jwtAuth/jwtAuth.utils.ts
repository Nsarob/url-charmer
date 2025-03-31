import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import User from "../../../database/models/user";
import passport from "passport";
import { UserResponseDTO } from "../auth.types";

const manageGoogleLogin = (profile: Profile, cb: VerifyCallback): void => {
  User.findOrCreate({
    where: { googleId: profile.id },
    defaults: {
      googleId: profile.id,
      username: profile.username ?? "N/A",
      email: profile.emails?.[0]?.value ?? "",
    },
  })
    .then(([user]) => cb(null, user))
    .catch((err) => cb(err));
};

export const configureGoogleStrategy = (GOOGLE_CLIENT_ID: string, GOOGLE_CLIENT_SECRET: string, CALLBACKURL: string): GoogleStrategy => {
  return new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACKURL,
  }, (accessToken, refreshToken, profile, cb) => manageGoogleLogin(profile, cb));
};



export const loginWithGoogle = passport.authenticate("google", { scope: ["profile", "email"] });

export const authenticateWithGoogle = passport.authenticate("google", { failureRedirect: "/" });

export const buildRedirectUrl = (response: UserResponseDTO, redirectUrl: string) => {
  return `${redirectUrl}?id=${response.id}&fullName=${response.username}`;
};
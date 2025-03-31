import User from "database/models/user";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/basic";
import { NotAuthorizedError, ApplicationError} from "../../utils/errors";

export interface DecodedJWT {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const createJWT = (user: User, duration: string = "15m") => {
  try {

    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: duration });

  } catch (err) {
    throw new ApplicationError('Error creating refresh token');
  }
};


export const verifyJWT = (token: string): DecodedJWT => {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedJWT;
  }
  catch (err) {
    throw new NotAuthorizedError('Invalid token');
  }
};

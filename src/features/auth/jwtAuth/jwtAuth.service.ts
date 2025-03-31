import User from "../../../database/models/user";
import BcryptService from "../../../utils/bcrypt";
import { Op } from "sequelize";
import { NotAuthorizedError, BadRequestError} from "../../../utils/errors";

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

/**
 * This function is used to authenticate a user using email and password.
 * It takes email and password as arguments and returns the user object if the authentication is successful.
 * If the authentication fails, it throws an error.
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns The user object if the authentication is successful
 * @throws If the authentication fails
 */
export const loginWithEmailOrUsernameAndPassword = async (email: string, password: string): Promise<User> => {

  // Find the user in the database
  const user = await User.findOne({
    where: { [Op.or]: [{ email }, { username: email }] }
  });

  // If the user is not found, throw an error
  if (!user) {
    throw new NotAuthorizedError("User not found");
  }

  // Compare the password with the hashed password in the database
  const isMatch = await BcryptService.comparePassword(password, user.password as string);

  // If the password is not correct, throw an error
  if (!isMatch) {
    throw new NotAuthorizedError("Invalid Credentials");
  }

  // Return the user object if the authentication is successful
  return user;
};


/**
 * Registers a new user with the provided email or username and password.
 *
 * @param {RegisterInput} data - The registration input containing username, email, and password.
 * @returns {Promise<User>} - A promise that resolves to the created user.
 * @throws {Error} - Throws an error if a user with the provided email or username already exists.
 */
export const registerUserWithEmailOrUsernameAndPassword = async (data: RegisterInput): Promise<User> => {

  const { username, email, password } = data;

  // Check if a user with the given email or username exists
  const existingUser = await User.findOne({
    where: { [Op.or]: [{ email }, { username }] }
  });

  if (existingUser) {
    throw new BadRequestError("A user with the provided email or username already exists.");
  }

  // Hash password and create the user
  const hashedPassword = await BcryptService.hashPassword(password);
  const user = await User.create({ username, email, password: hashedPassword });
  return user;
};


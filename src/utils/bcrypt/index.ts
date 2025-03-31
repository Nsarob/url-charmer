/*
bcrypt/index.ts

Description: This file contains the implementation of the BcryptService class, which provides methods for hashing and comparing passwords using bcrypt.
Author: damour nsanzimfura<blaiseniyonkuru12@gmail.com>

*/

import {  hash, compare } from 'bcrypt';


export class BcryptService {
    /**
     * Number of salt rounds for password hashing
     * Recommended: 10-12 for balance between security and performance
     */

    private static SALT_ROUNDS = 12;

    /**
     * Hash a plain text password
     * @param password - Plain text password to hash
     * @returns Promise resolving to hashed password
     */
    static async hashPassword(password: string): Promise<string> {
        // Input validation
        if (!password) {
            throw new Error('Password cannot be empty');
        }

        try {
            // Generate salt and hash password
            // const salt = await genSalt(this.SALT_ROUNDS);
            const hashedPassword = await hash(password, this.SALT_ROUNDS);
            return hashedPassword;
        } catch (error) {
            console.error('Password hashing error:', error);
            throw new Error('Failed to hash password');
        }
    }

    /**
     * Compare a plain text password with a hashed password
     * @param plainTextPassword - Password to check
     * @param hashedPassword - Stored hashed password to compare against
     * @returns Promise resolving to boolean indicating match
     */
    static async comparePassword(
        plainTextPassword: string,
        hashedPassword: string
    ): Promise<boolean> {

        // Input validation
        if (!plainTextPassword || !hashedPassword) {
            throw new Error('Both plain text and hashed passwords are required');
        }

        try {
            // Compare passwords using bcrypt
            const isMatch = await compare(plainTextPassword, hashedPassword);
            return isMatch;
        } catch (error) {
            console.error('Password comparison error:', error);
            throw new Error('Failed to compare passwords');
        }
    }
}

export default BcryptService
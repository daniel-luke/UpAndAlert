import { z } from 'zod'
import { UserService } from "~~/server/modules/auth/services/UserService";
import type { User } from "~~/server/modules/auth/interfaces/User";

const bodySchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

/**
 * Login a user
 * @route POST /api/login
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {object} - The user object
 * @throws {Error} - If the user does not exist or the password is invalid
 * @throws {Error} - If body is invalid
 * @example response - 200 - User logged in successfully
 * {
 *  "statusCode": 200,
 *  "message": "Successfully logged in.",
 *  "user": {
 *      "first_name": "John",
 *      "last_name": "Doe",
 *      "email": "john.doe@example.com",
 *      "is_admin": false
 *  }
 * }
 */
export default defineEventHandler(async (event) => {
    const { email, password } = await readValidatedBody(event, bodySchema.parse)

    const userService = UserService.getInstance();
    const user: User | undefined = await userService.getUserByEmail(email);
    if (user === undefined) {
        throw createError({
            statusCode: 401,
            message: 'User does not exist.'
        })
    }

    const hasValidPassword = await userService.passwordMatches(password, user);
    if (!hasValidPassword) {
        throw createError({
            statusCode: 401,
            message: 'Invalid password.'
        })
    }

    setResponseStatus(event, 200);
    await setUserSession(event, {
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            is_admin: user.is_admin
        }
    })
    return {
        statusCode: 200,
        message: 'Successfully logged in.',
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            is_admin: user.is_admin
        }
    }
})

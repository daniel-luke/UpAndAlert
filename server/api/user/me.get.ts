import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '~~/server/modules/auth/models/User'

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
    const userService = UserService.getInstance()
    const session: User = await userService.getUserSession(event)
    const user = await userService.getUserByEmail(session.email)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found.'
        })
    }

    setResponseStatus(event, 200)
    return {
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            is_admin: user.is_admin.toString() === '1'
        }
    }
})

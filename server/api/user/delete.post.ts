import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '~~/server/modules/auth/models/User'

const bodySchema = z.object({
    id: z.number()
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
    const userService = UserService.getInstance()
    await userService.isLoggedIn(event)

    const { id } = await readValidatedBody(event, bodySchema.parse)
    const session: User = await userService.getUserSession(event)

    if (!session.is_admin) {
        throw createError({
            statusCode: 403,
            message: 'You are not authorized to perform this action.'
        })
    }

    const user = await userService.getUserById(id)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found.'
        })
    }
    await userService.deleteUser(user.id)

    setResponseStatus(event, 200)
    return {
        statusCode: 200,
        message: 'Successfully deleted user.'
    }
})

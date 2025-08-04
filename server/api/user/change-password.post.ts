import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '~~/server/modules/auth/models/User'

const bodySchema = z.object({
    password: z.string().min(8).optional(),
    new_password: z.string().min(8).optional()
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
    const { password, new_password } = await readValidatedBody(event, bodySchema.parse)

    const userService = UserService.getInstance()
    const session: User = await userService.getUserSession(event)
    const user = await userService.getUserByEmail(session.email)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found.'
        })
    }

    const newUser: User = user

    if (!password || !(await userService.passwordMatches(password, user))) {
        throw createError({
            statusCode: 401,
            message: 'Invalid password.'
        })
    }

    // @ts-expect-error - password is not defined in the User type but uses in partial for updating
    newUser.password = new_password

    await userService.updateUser(newUser.id, newUser)

    setResponseStatus(event, 200)
    return {
        statusCode: 200,
        message: 'Password changed successfully.'
    }
})

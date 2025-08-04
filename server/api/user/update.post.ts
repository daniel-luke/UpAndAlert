import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '~~/server/modules/auth/models/User'

const bodySchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    is_admin: z.boolean().optional()
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

    const { first_name, last_name, email, password, is_admin } = await readValidatedBody(
        event,
        bodySchema.parse
    )

    const session: User = await userService.getUserSession(event)

    let user = await userService.getUserByEmail(session.email)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found.'
        })
    }

    const newUser: User = user
    if (first_name !== undefined) newUser.first_name = first_name
    if (last_name !== undefined) newUser.last_name = last_name
    if (is_admin !== undefined) newUser.is_admin = is_admin
    if (email !== undefined) newUser.email = email

    // @ts-expect-error - password is not defined in the User type but uses in partial for updating
    if (password !== undefined) newUser.password = password

    await userService.updateUser(newUser.id, newUser)

    setResponseStatus(event, 200)
    await setUserSession(event, {
        user: {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            is_admin: newUser.is_admin
        }
    })

    user = await userService.getUserSession(event)
    return {
        statusCode: 200,
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            is_admin: user.is_admin
        }
    }
})

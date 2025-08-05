import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '#auth-utils'

const bodySchema = z.object({
    password: z.string().min(8).optional(),
    new_password: z.string().min(8).optional()
})

/**
 * @description change user password
 * @route POST /api/user/change-password
 * @access Private
 * @param {string} password - current password
 * @param {string} new_password - new password
 * @returns {statusCode: number, message: string}
 */
export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const { password, new_password } = await readValidatedBody(event, bodySchema.parse)

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

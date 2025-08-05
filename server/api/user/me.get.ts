import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '#auth-utils'

/**
 * @description Get the current user session
 * @route GET /api/users/me
 * @access Private
 * @returns { User: User }
 */
export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const user: User = await userService.getUserSession(event)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found.'
        })
    }

    setResponseStatus(event, 200)
    return user
})

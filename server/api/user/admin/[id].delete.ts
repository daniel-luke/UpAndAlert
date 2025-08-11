import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'

const bodySchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    is_admin: z.boolean().optional()
})

/**
 * @description Updates a user
 * @route POST /api/users/update
 * @access Private
 * @param {first_name: string, last_name: string, email: string, password: string, is_admin: boolean}
 * @returns {statusCode: number, user: User}
 */
export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)
    await userService.checkAdmin(event)

    const { id } = getRouterParams(event)

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'User ID is required.'
        })
    }

    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
        throw createError({
            statusCode: 400,
            message: 'User ID must be a number.'
        })
    }

    let user = await userService.getUserById(parsedId)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found.'
        })
    }
    await userService.deleteUser(user.id)

    user = await userService.getUserById(parsedId)
    if (user) {
        throw createError({
            statusCode: 500,
            message: 'User not deleted.'
        })
    }

    setResponseStatus(event, 200)
    return
})

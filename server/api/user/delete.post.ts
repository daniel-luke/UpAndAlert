import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '#auth-utils'

const bodySchema = z.object({
    id: z.number()
})

/**
 * @description Delete a user by id
 * @route POST /api/users/delete
 * @access Private
 * @param {number} id - The id of the user to delete
 * @returns {statusCode: number, message: string}
 */
export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

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

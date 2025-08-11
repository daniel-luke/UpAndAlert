import { UserService } from '~~/server/modules/auth/services/UserService'

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

    const user = await userService.getUserById(parsedId)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found.'
        })
    }

    setResponseStatus(event, 200)
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_admin: user.is_admin
    }
})

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

    setResponseStatus(event, 200)

    const users = await userService.listUsers()
    if (!users) {
        return []
    }

    return users
})

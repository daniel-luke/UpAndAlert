import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '#auth-utils'

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

    const { first_name, last_name, email, password, is_admin } = await readValidatedBody(
        event,
        bodySchema.parse
    )

    let user = await userService.getUserById(parsedId)
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

    user = await userService.getUserById(newUser.id)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found.'
        })
    }

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

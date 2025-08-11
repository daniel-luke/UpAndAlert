import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '#auth-utils'

const bodySchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.email(),
    password: z.string().min(8),
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
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            message: 'Method not allowed.'
        })
    }

    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)
    await userService.checkAdmin(event)

    const { first_name, last_name, email, password, is_admin } = await readValidatedBody(
        event,
        bodySchema.parse
    )

    let user = await userService.getUserByEmail(email)
    if (user) {
        throw createError({
            statusCode: 400,
            message: 'User already exists.'
        })
    }

    const newUser: Omit<User, 'id' | 'password_hash'> = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        is_admin: !!is_admin
    }

    await userService.createUser({
        ...newUser,
        password: password
    })

    setResponseStatus(event, 200)

    user = await userService.getUserByEmail(newUser.email)
    if (!user) {
        throw createError({
            statusCode: 400,
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

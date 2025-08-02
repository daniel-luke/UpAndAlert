import { z } from 'zod'
import {UserService} from "~~/server/modules/auth/services/UserService";
import type {User} from "~~/server/modules/auth/interfaces/User";

const bodySchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
    const { email, password } = await readValidatedBody(event, bodySchema.parse)

    const userService = UserService.getInstance();
    const user: User | undefined = await userService.getUserByEmail(email);
    if (user === undefined) {
        throw createError({
            statusCode: 401,
            message: 'User does not exist.'
        })
    }

    const hasValidPassword = await userService.passwordMatches(password, user);
    if (!hasValidPassword) {
        throw createError({
            statusCode: 401,
            message: 'Invalid password.'
        })
    }

    setResponseStatus(event, 200);
    await setUserSession(event, {
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            is_admin: user.is_admin
        }
    })
    return {
        statusCode: 200,
        message: 'Successfully logged in.',
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            is_admin: user.is_admin
        }
    }
})

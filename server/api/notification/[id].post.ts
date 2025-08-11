import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import { NotificationService } from '~~/server/modules/notifications/services/NotificationService'
import type { Notification } from '~~/server/modules/notifications/models/Notification'

const bodySchema = z.object({
    name: z.string().min(3),
    notification_type: z.string(),
    hostname: z.string().min(3),
    port: z.number().min(1).max(65535),
    username: z.string().optional(),
    password: z.string().optional(),
    from: z.email(),
    to: z.email(),
    cc: z.string().optional(),
    bcc: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    tls: z.boolean().optional(),
    is_active: z.boolean()
})

/**
 * @description Creates a new monitor
 * @route POST /api/monitor/create
 * @access Private
 * @param {first_name: string, last_name: string, email: string, password: string, is_admin: boolean}
 * @returns {statusCode: number, user: User}
 */
export default defineEventHandler(async (event) => {
    const id: string | undefined = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Missing id'
        })
    }

    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const body = await readValidatedBody(event, bodySchema.parse)

    const notificationService = NotificationService.getInstance()
    const newNotification: Notification = {
        id: parseInt(id),
        ...body
    }
    await notificationService.updateNotification(newNotification).catch((error) => {
        throw createError({
            statusCode: 400,
            message: error.message
        })
    })

    setResponseStatus(event, 200)
    return newNotification
})

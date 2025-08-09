import { UserService } from '~~/server/modules/auth/services/UserService'
import { NotificationService } from '~~/server/modules/notifications/services/NotificationService'

export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const notificationService = NotificationService.getInstance()
    const notifications = await notificationService.getAllNotifications()
    if (!notifications) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found'
        })
    }
    return notifications
})

import { UserService } from '~~/server/modules/auth/services/UserService'
import { NotificationService } from '~~/server/modules/notifications/services/NotificationService'
import type { Notification } from '~~/server/modules/notifications/models/Notification'

export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const id: string | undefined = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request'
        })
    }

    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request'
        })
    }

    const notificationService = NotificationService.getInstance()
    const notification: Notification | undefined =
        await notificationService.getNotificationById(parsedId)
    if (!notification) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found'
        })
    }
    const monitorsToDetach = await notificationService.getMonitorsForNotification(notification)
    monitorsToDetach.forEach((monitor) => {
        notificationService.detachNotificationFromMonitor(monitor, notification)
    })
    await notificationService.deleteNotification(notification)

    return
})

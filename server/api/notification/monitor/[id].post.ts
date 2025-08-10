import { UserService } from '~~/server/modules/auth/services/UserService'
import { NotificationService } from '~~/server/modules/notifications/services/NotificationService'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const { notificationId } = await readBody(event)
    if (!notificationId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request'
        })
    }

    const id: string | undefined = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request'
        })
    }

    const parsedNotificationId = parseInt(notificationId)
    const parsedId = parseInt(id)
    if (isNaN(parsedId) || isNaN(parsedNotificationId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request'
        })
    }

    const monitorService = MonitorService.getInstance()
    const monitor = await monitorService.getMonitorById(parsedId)
    if (!monitor) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Monitor Not Found'
        })
    }
    const notificationService = NotificationService.getInstance()
    const notification = await notificationService.getNotificationById(notificationId)
    if (!notification) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Notification Not Found'
        })
    }

    const attachedNotifications = await notificationService.getNotificationsForMonitor(monitor)
    attachedNotifications.forEach((attachedNotification) => {
        if (attachedNotification.id === notification.id) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Notification Already Attached'
            })
        }
    })

    await notificationService.attachNotificationToMonitor(monitor, notification)

    setResponseStatus(event, 201)
    return
})

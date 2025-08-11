import { UserService } from '~~/server/modules/auth/services/UserService'
import { NotificationService } from '~~/server/modules/notifications/services/NotificationService'
import type { Notification } from '~~/server/modules/notifications/models/Notification'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

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

    const monitorService = MonitorService.getInstance()
    const monitor = await monitorService.getMonitorById(parsedId)
    if (!monitor) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Monitor Not Found'
        })
    }
    const notificationService = NotificationService.getInstance()
    const notifications: Notification[] | undefined =
        await notificationService.getNotificationsForMonitor(monitor)

    if (!notifications) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Notifications Not Found'
        })
    }

    return notifications
})

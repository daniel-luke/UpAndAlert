import { UserService } from '~~/server/modules/auth/services/UserService'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

/**
 * @description Get uptime percentages for a specific monitor
 * @route GET /api/monitor/uptime/:id
 * @access Private
 * @returns { Monitor: Monitor }
 */
export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const id: string | undefined = getRouterParam(event, 'id')
    let parsedId: number | null = null

    try {
        if (!id) {
            throw new Error('Invalid ID')
        }
        parsedId = parseInt(id)
        if (isNaN(parsedId)) {
            throw new Error('ID should be a number')
        }
    } catch (error) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request: ' + error
        })
    }

    const monitorService = MonitorService.getInstance()
    const monitor = await monitorService.getMonitorById(parsedId)

    if (!monitor) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Monitor not found'
        })
    }
    const uptime = await monitorService.getUptime(monitor)
    if (!uptime) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error getting uptime'
        })
    }

    setResponseStatus(event, 200)
    return uptime
})

import { UserService } from '~~/server/modules/auth/services/UserService'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

/**
 * @description Get monitor
 * @route GET /api/monitor/:id
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

    setResponseStatus(event, 200)
    return monitor
})

import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

const bodySchema = z.object({
    id: z.number()
})

/**
 * @description Creates a new monitor
 * @route POST /api/monitor/create
 * @access Private
 * @param {first_name: string, last_name: string, email: string, password: string, is_admin: boolean}
 * @returns {statusCode: number, user: User}
 */
export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const { id } = await readValidatedBody(event, bodySchema.parse)

    const monitorService: MonitorService = MonitorService.getInstance()
    const monitor = await monitorService.getMonitorById(id)
    if (!monitor) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Monitor not found'
        })
    }

    await monitorService.stopMonitor(monitor)
    await monitorService.deleteMonitor(id)

    setResponseStatus(event, 204)

    return
})

import { UserService } from '~~/server/modules/auth/services/UserService'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'
import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'

/**
 * @description Get all monitors
 * @route GET /api/monitor/list
 * @access Private
 * @returns { Monitor[]: Monitor }
 */
export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const monitorService = MonitorService.getInstance()

    const query = getQuery(event)
    const { page, limit } = query

    let monitors: Monitor[] = []
    const totalAmount = await monitorService.listMonitors().then((monitors) => monitors.length)

    if (page && limit) {
        monitors = await monitorService.paginateMonitors(Number(page), Number(limit))
    } else {
        monitors = await monitorService.listMonitors()
    }

    setResponseStatus(event, 200)
    return {
        monitors: monitors,
        total: totalAmount
    }
})

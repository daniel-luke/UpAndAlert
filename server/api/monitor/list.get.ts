import { UserService } from '~~/server/modules/auth/services/UserService'
import type { User } from '#auth-utils'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

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
    const monitors = await monitorService.listMonitors()

    setResponseStatus(event, 200)
    return monitors
})

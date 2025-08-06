import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

const bodySchema = z.object({
    name: z.string().min(3),
    monitor_type: z.string(),
    address: z.url(),
    polling_interval: z.number().min(60)
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

    const { name, monitor_type, address, polling_interval } = await readValidatedBody(
        event,
        bodySchema.parse
    )

    const monitorService: MonitorService = MonitorService.getInstance()

    const newMonitor: {
        name: string
        monitor_type: string
        address: string
        polling_interval: number
    } = {
        name,
        monitor_type,
        address,
        polling_interval
    }

    const created = await monitorService.createMonitor(newMonitor)
    await monitorService.startMonitor(created)

    setResponseStatus(event, 201)

    return
})

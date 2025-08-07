import { z } from 'zod'
import { UserService } from '~~/server/modules/auth/services/UserService'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

const bodySchema = z.object({
    id: z.number(),
    name: z.string().min(3),
    monitor_type: z.string(),
    address: z.url(),
    polling_interval: z.number().min(60)
})

/**
 * @description Updates a monitor
 * @route POST /api/monitor/update
 * @access Private
 * @param {first_name: string, last_name: string, email: string, password: string, is_admin: boolean}
 * @returns {statusCode: number, user: User}
 */
export default defineEventHandler(async (event) => {
    const userService = UserService.getInstance()
    await userService.checkAuthenticated(event)

    const { id, name, monitor_type, address, polling_interval } = await readValidatedBody(
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

    const success = await monitorService.updateMonitor(id, newMonitor)
    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Failed to update monitor'
        })
    }

    setResponseStatus(event, 201)

    return
})

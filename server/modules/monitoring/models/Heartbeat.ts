import type { Status } from '~~/server/modules/monitoring/types/Status'

/**
 * @name User
 * @description User model
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export interface Heartbeat {
    id: number
    monitor_id: number
    created_at: Date
    status_code: number
    status: Status
}

import type { CronJob } from 'cron'

/**
 * @name Monitor
 * @description Monitor model
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export interface Monitor {
    id: number
    name: string
    monitor_type: string
    address: string
    polling_interval: number
    in_maintenance: boolean
    is_active: boolean
    notified: number
    job: CronJob | null

    startJob(): void

    stopJob(): void
}

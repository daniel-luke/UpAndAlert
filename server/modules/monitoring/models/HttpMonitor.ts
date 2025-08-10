import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import { CronJob } from 'cron'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'
import { timeToCron } from '@aquarela/time-to-cron'

/**
 * @name HttpMonitor
 * @description HttpMonitor model
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class HttpMonitor implements Monitor {
    address: string
    id: number
    in_maintenance: boolean
    is_active: boolean
    monitor_type: string
    name: string
    polling_interval: number
    notified: number
    job: CronJob | null = null
    logger: Logger = Logger.getInstance()
    monitorService: MonitorService = MonitorService.getInstance()

    constructor(monitor: Monitor) {
        if (monitor.monitor_type !== 'http') throw new Error('Invalid monitor type on creation')

        this.address = monitor.address
        this.id = monitor.id
        this.in_maintenance = monitor.in_maintenance
        this.is_active = monitor.is_active
        this.monitor_type = monitor.monitor_type
        this.notified = monitor.notified
        this.name = monitor.name
        this.polling_interval = monitor.polling_interval
    }

    public startJob() {
        const cb = async () => {
            const start = performance.now()
            await $fetch
                .raw(this.address)
                .then((res) => {
                    const end = performance.now()
                    const responseTime = end - start

                    switch (res.status) {
                        case 200:
                            this.monitorService.registerHeartBeat(
                                this,
                                res.status,
                                'up',
                                responseTime
                            )
                            return
                    }
                    this.monitorService.registerHeartBeat(this, res.status, 'down', responseTime)
                })
                .catch(() => {
                    const end = performance.now()
                    const responseTime = end - start
                    this.monitorService.registerHeartBeat(this, 500, 'down', responseTime)
                })
        }

        const exp = timeToCron(this.polling_interval)
        const job = new CronJob(exp, cb, null, true)
        this.job = job
        if (this.job) cb()
    }

    public stopJob() {
        if (this.job) this.job.stop()
        this.job = null
    }
}

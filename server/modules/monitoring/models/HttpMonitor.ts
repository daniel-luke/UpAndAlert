import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import { CronJob } from 'cron'

export class HttpMonitor implements Monitor {
    address: string
    id: number
    in_maintenance: boolean
    is_active: boolean
    monitor_type: string
    name: string
    polling_interval: number
    job: CronJob | null = null

    constructor(monitor: Monitor) {
        if (monitor.monitor_type !== 'http') throw new Error('Invalid monitor type on creation')

        this.address = monitor.address
        this.id = monitor.id
        this.in_maintenance = monitor.in_maintenance
        this.is_active = monitor.is_active
        this.monitor_type = monitor.monitor_type
        this.name = monitor.name
        this.polling_interval = monitor.polling_interval
    }

    public startJob() {
        const cb = () => {
            $fetch(this.address)
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        const job = new CronJob(`*/5 * * * * *`, cb, null, true)
        this.job = job
    }
}

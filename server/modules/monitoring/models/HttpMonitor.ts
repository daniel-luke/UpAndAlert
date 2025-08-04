import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import { CronJob } from 'cron'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

export class HttpMonitor implements Monitor {
    address: string
    id: number
    in_maintenance: boolean
    is_active: boolean
    monitor_type: string
    name: string
    polling_interval: number
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
        this.name = monitor.name
        this.polling_interval = monitor.polling_interval
    }

    public startJob() {
        const cb = () => {
            $fetch
                .raw(this.address)
                .then((res) => {
                    console.log(this.address + ' ' + res.status)
                    switch (res.status) {
                        case 200:
                            this.monitorService.registerHeartBeat(this, res.status, 'up')
                            return
                    }
                    this.monitorService.registerHeartBeat(this, res.status, 'down')
                })
                .catch(() => {
                    this.logger.error('HTTP', 'Could not fetch address: ' + this.address)
                })
        }

        const job = new CronJob(`*/5 * * * * *`, cb, null, true)
        this.job = job
    }
}

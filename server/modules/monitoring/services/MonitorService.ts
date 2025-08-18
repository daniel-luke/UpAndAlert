import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import { MonitorRepository } from '~~/server/modules/monitoring/repositories/MonitorRepository'
import { HttpMonitor } from '~~/server/modules/monitoring/models/HttpMonitor'
import type { Status } from '~~/server/modules/monitoring/types/Status'
import { sendMonitorUpdate } from '~~/server/utils/monitor-clients'
import { SmtpService } from '~~/server/modules/notifications/services/SmtpService'
import { NotificationService } from '~~/server/modules/notifications/services/NotificationService'
import type { Notification } from '~~/server/modules/notifications/models/Notification'

/**
 * @name MonitorService
 * @description Service class for handling monitor-related operations.
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class MonitorService {
    private static instance: MonitorService

    private activeMonitorJobs: unknown[]

    private constructor(private monitorRepository: MonitorRepository) {
        this.activeMonitorJobs = []
    }

    static getInstance(): MonitorService {
        if (!MonitorService.instance) {
            MonitorService.instance = new MonitorService(MonitorRepository.getInstance())
        }
        return MonitorService.instance
    }

    async getMonitorById(id: number): Promise<Monitor | undefined> {
        return this.monitorRepository.findById(id)
    }

    async createMonitor(
        data: Omit<
            Monitor,
            'id' | 'in_maintenance' | 'is_active' | 'job' | 'startJob' | 'stopJob' | 'notified'
        >
    ): Promise<Monitor> {
        return this.monitorRepository.create({
            name: data.name,
            monitor_type: data.monitor_type,
            address: data.address,
            polling_interval: data.polling_interval
        })
    }

    async updateMonitor(
        id: number,
        updates: Partial<Omit<Monitor, 'id' | 'in_maintenance' | 'is_active'>>
    ): Promise<Monitor | undefined> {
        const newMonitor = await this.monitorRepository.update(id, updates)
        if (!newMonitor) {
            return undefined
        }
        const oldMonitor = this.activeMonitorJobs.find((job) => {
            const tempMonitor = job as Monitor
            return tempMonitor.id === newMonitor.id
        }) as Monitor
        if (!oldMonitor && newMonitor.is_active) {
            return undefined
        }

        if (oldMonitor) await this.stopMonitor(oldMonitor)

        this.activeMonitorJobs = this.activeMonitorJobs.filter((job) => {
            const tempMonitor = job as Monitor
            return tempMonitor.id !== newMonitor.id
        })
        if (newMonitor.is_active) await this.startMonitor(newMonitor)
        return newMonitor
    }

    async deleteMonitor(id: number): Promise<void> {
        await this.monitorRepository.delete(id)
    }

    async listMonitors(): Promise<Monitor[]> {
        return this.monitorRepository.all()
    }

    async listActiveMonitors(): Promise<Monitor[]> {
        return this.monitorRepository.allActive()
    }

    async paginateMonitors(page: number, limit: number): Promise<Monitor[]> {
        return this.monitorRepository.paginate(page, limit)
    }

    async startMonitor(monitor: Monitor) {
        switch (monitor.monitor_type) {
            case 'http': {
                const httpMonitor = new HttpMonitor(monitor)
                httpMonitor.startJob()
                this.activeMonitorJobs.push(httpMonitor)
                break
            }
            default:
                throw new Error('Invalid monitor type')
        }
    }

    async stopMonitor(monitor: Monitor) {
        const job = this.activeMonitorJobs.find((job) => {
            const tempMonitor = job as Monitor
            return tempMonitor.id === monitor.id
        })

        const foundMonitor = job as Monitor
        if (foundMonitor) {
            foundMonitor.stopJob()
            this.activeMonitorJobs = this.activeMonitorJobs.filter((job) => {
                const tempMonitor = job as Monitor
                return tempMonitor.id !== monitor.id
            })
        }
    }

    async pauseMonitor(monitor: Monitor) {
        await this.stopMonitor(monitor)
        await this.monitorRepository.pause(monitor.id)
    }

    async resumeMonitor(monitor: Monitor) {
        await this.startMonitor(monitor)
        await this.monitorRepository.resume(monitor.id)
    }

    async registerHeartBeat(
        monitor: Monitor,
        statusCode: number,
        status: Status,
        responseTime: number
    ) {
        const heartbeat = await this.monitorRepository.registerHeartbeat(
            monitor,
            statusCode,
            status,
            responseTime
        )
        sendMonitorUpdate(monitor.id.toString(), {
            created_at: heartbeat.created_at,
            status: heartbeat.status,
            status_code: heartbeat.status_code,
            response_time: heartbeat.response_time
        })

        // Send notification if monitor is down or up again
        // If down message has been sent and status is up then send up message
        if (monitor.notified === 1 && status === 'up') {
            // Send up message
            await this.sendUpMessage(monitor)
            await this.monitorRepository.setNotified(monitor, false)
            monitor.notified = 0
        }

        // If down message has not been sent and status is down then send down message
        if (monitor.notified === 0 && status === 'down') {
            // Send down message
            await this.sendDownMessage(monitor)
            await this.monitorRepository.setNotified(monitor, true)
            monitor.notified = 1
        }
        return heartbeat
    }

    async getHeartBeatHistory(monitor: Monitor, limit: number = 20) {
        return this.monitorRepository.getHeartbeatHistory(monitor, limit)
    }

    async getUptime(monitor: Monitor) {
        const history = await this.monitorRepository.getHeartbeatHistory(monitor)
        const total = history.length
        const up = history.filter((heartbeat) => heartbeat.status === 'up').length
        return { up: (up / total) * 100, down: ((total - up) / total) * 100 }
    }

    async getLastHeartbeat(monitor: Monitor) {
        return this.monitorRepository.getLastHeartbeat(monitor)
    }

    private async sendUpMessage(monitor: Monitor) {
        const notifications: Notification[] =
            await NotificationService.getInstance().getNotificationsForMonitor(monitor)

        for (const notification of notifications) {
            if (notification.notification_type === 'smtp')
                await SmtpService.getInstance().sendUpMail(notification, monitor)
        }
    }

    private async sendDownMessage(monitor: Monitor) {
        const notifications: Notification[] =
            await NotificationService.getInstance().getNotificationsForMonitor(monitor)

        for (const notification of notifications) {
            if (notification.notification_type === 'smtp')
                await SmtpService.getInstance().sendDownMail(notification, monitor)
        }
    }
}

import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import { NotificationRepository } from '~~/server/modules/notifications/repositories/NotificationRepository'
import type { Notification } from '~~/server/modules/notifications/models/Notification'

/**
 * @name NotificationService
 * @description Service class for handling notification-related operations.
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class NotificationService {
    private static instance: NotificationService

    private constructor(private notificationRepository: NotificationRepository) {}

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService(
                NotificationRepository.getInstance()
            )
        }
        return NotificationService.instance
    }

    async createNotification(notification: Omit<Notification, 'id'>) {
        return await this.notificationRepository.createNotification(notification)
    }

    async updateNotification(notification: Notification) {
        return await this.notificationRepository.updateNotification(notification)
    }

    async deleteNotification(notification: Notification) {
        return await this.notificationRepository.deleteNotification(notification)
    }

    async getNotificationById(id: number) {
        return await this.notificationRepository.getNotificationById(id)
    }

    async getAllNotifications() {
        return await this.notificationRepository.getAllNotifications()
    }

    async attachNotificationToMonitor(monitor: Monitor, notification: Notification) {
        return await this.notificationRepository.attachNotificationToMonitor(monitor, notification)
    }

    async detachNotificationFromMonitor(monitor: Monitor, notification: Notification) {
        return await this.notificationRepository.detachNotificationFromMonitor(
            monitor,
            notification
        )
    }

    async getNotificationsForMonitor(monitor: Monitor) {
        return await this.notificationRepository.getNotificationsForMonitor(monitor)
    }

    async getMonitorsForNotification(notification: Notification) {
        return await this.notificationRepository.getMonitorsForNotification(notification)
    }
}

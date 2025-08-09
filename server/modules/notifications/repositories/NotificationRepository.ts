import type { Knex } from 'knex'
import { DatabaseService } from '~~/server/modules/core/services/DatabaseService'
import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import type { Notification } from '~~/server/modules/notifications/models/Notification'

/**
 * @name NotificationRepository
 * @description Repository for notification operations
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class NotificationRepository {
    private static instance: NotificationRepository

    private db: Knex = DatabaseService.getInstance().getAdapter().getKnex()

    private constructor() {}

    static getInstance(): NotificationRepository {
        if (!NotificationRepository.instance) {
            NotificationRepository.instance = new NotificationRepository()
        }
        return NotificationRepository.instance
    }

    async createNotification(notification: Omit<Notification, 'id'>) {
        return this.db('notifications').insert(notification)
    }

    async updateNotification(notification: Notification) {
        return this.db('notifications').where('id', notification.id).update(notification)
    }

    async deleteNotification(notification: Notification) {
        return this.db('notifications').where('id', notification.id).delete()
    }

    async getNotificationById(id: number) {
        return this.db<Notification>('notifications').where('id', id).first()
    }

    async getAllNotifications() {
        return this.db<Notification>('notifications').then((notifications) => {
            return notifications.map((notification) => {
                return {
                    id: notification.id,
                    name: notification.name,
                    notification_type: notification.notification_type,
                    is_active: (notification.is_active = !!1)
                }
            })
        })
    }

    async attachNotificationToMonitor(monitor: Monitor, notification: Notification) {
        return this.db('monitor_notification').insert({
            monitor_id: monitor.id,
            notification_id: notification.id
        })
    }

    async detachNotificationFromMonitor(monitor: Monitor, notification: Notification) {
        return this.db('monitor_notification')
            .where('monitor_id', monitor.id)
            .andWhere('notification_id', notification.id)
            .delete()
    }

    async getNotificationsForMonitor(monitor: Monitor) {
        return this.db<Notification>('notifications')
            .join(
                'monitor_notifications',
                'notifications.id',
                '=',
                'monitor_notifications.notification_id'
            )
            .where('monitor_notifications.monitor_id', monitor.id)
    }

    async getMonitorsForNotification(notification: Notification) {
        return this.db<Monitor[]>('monitors')
            .join('monitor_notifications', 'monitors.id', '=', 'monitor_notifications.monitor_id')
            .where('monitor_notifications.notification_id', notification.id)
    }
}

import { NotificationType } from '~~/server/modules/notifications/types/NotificationType'

/**
 * @name Notification
 * @description Notification model
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export interface Notification {
    id: number
    name: string
    notification_type: NotificationType
    hostname: string
    port: number
    username: string
    password: string
    from: string
    to: string
    cc: string
    bcc: string
    subject: string
    message: string
    tls: boolean
    is_active: boolean
}

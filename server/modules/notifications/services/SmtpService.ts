import type { Notification } from '~~/server/modules/notifications/models/Notification'
import nodemailer from 'nodemailer'

/**
 * @name SMTPService
 * @description Service class for handling smtp-related operations.
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class SmtpService {
    private static instance: SmtpService

    private constructor() {}

    static getInstance(): SmtpService {
        if (!SmtpService.instance) {
            SmtpService.instance = new SmtpService()
        }
        return SmtpService.instance
    }

    async sendMail(notification: Notification) {
        if (notification.notification_type !== 'smtp') {
            throw new Error('Notification type is not smtp. Yet tried to send smtp notification.')
        }

        const transporter = nodemailer.createTransport({
            host: notification.hostname,
            port: notification.port,
            secure: notification.tls
        })

        await transporter
            .verify()
            .then(async () => {
                transporter.sendMail({
                    from: notification.from,
                    to: notification.to,
                    subject: notification.subject,
                    html: notification.message
                })
            })
            .catch((err) => {
                throw new Error(err)
            })
    }
}

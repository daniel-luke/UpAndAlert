import type { Notification } from '~~/server/modules/notifications/models/Notification'
import nodemailer from 'nodemailer'
import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'

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

    async sendUpMail(notification: Notification, monitor: Monitor) {
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
                    subject: `✅️[PulseWatch] ${monitor.name} Service is up`,
                    html: `${monitor.name} on: ${monitor.address} is back up!`
                })
            })
            .catch((err) => {
                throw new Error(err)
            })
    }

    async sendDownMail(notification: Notification, monitor: Monitor) {
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
                let opts: object = {
                    from: notification.from,
                    to: notification.to,
                    subject: `🚨 [PulseWatch] ${monitor.name} Service is down`,
                    html: `${monitor.name} on: ${monitor.address} just went down.`
                }

                if (notification.username && notification.password) {
                    opts = {
                        username: notification.username,
                        password: notification.password,
                        ...opts
                    }
                }

                if (notification.cc) {
                    opts = {
                        cc: notification.cc,
                        ...opts
                    }
                }

                if (notification.bcc) {
                    opts = {
                        bcc: notification.bcc,
                        ...opts
                    }
                }

                transporter.sendMail(opts)
            })
            .catch((err) => {
                throw new Error(err)
            })
    }
}

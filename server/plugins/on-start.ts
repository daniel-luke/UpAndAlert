import { Logger } from '~~/server/utils/Logger'
import type { Knex } from 'knex'
import { DatabaseService } from '~~/server/modules/core/services/DatabaseService'
import { UserService } from '~~/server/modules/auth/services/UserService'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

const logger = Logger.getInstance()

export default defineNitroPlugin(async () => {
    // Startup message
    logger.info('core', 'Starting up application')

    // Connect to DB and perform migrations
    const db: Knex | null = await prepareDatabase()

    if (db === null) {
        logger.error('core', 'No database connection')
        process.exit(1)
    }

    // Check if fresh installation is needed
    const needsInstall = await db
        .table('users')
        .count()
        .then((res) => {
            return res[0]['count(*)'] === 0
        })

    // Initialize the application for first time use
    if (needsInstall) {
        logger.info('core', 'Fresh installation detected,.')
        await bootstrap()
    }

    await startMonitors()
    await postInstall()
})

/**
 * Prepare the database connection and run migrations
 * @returns {Promise<Knex | null>}
 */
async function prepareDatabase(): Promise<Knex | null> {
    const adapter = DatabaseService.getInstance().getAdapter()
    await adapter.connect()
    await adapter.migrate()
    return adapter.getKnex()
}

/**
 * Bootstraps the application
 * @returns {Promise<void>}
 */
async function bootstrap() {
    logger.info('core', 'Bootstrapping application')

    const userService = UserService.getInstance()
    const randomPassword = generateRandomString(16)
    await userService
        .createUser({
            email: 'admin@system.local',
            password: randomPassword,
            first_name: 'Admin',
            last_name: 'User'
        })
        .then(() => {
            logger.info(
                'core',
                `Created admin user with email: admin@system.local and password: ${randomPassword}`
            )
        })
}

/**
 * Start all monitors
 * @returns {Promise<void>}
 */
async function startMonitors() {
    logger.info('mon', 'Starting monitors')
    const monitorService = MonitorService.getInstance()
    const monitors = await monitorService.listActiveMonitors()
    logger.info('mon', `Found ${monitors.length} monitors to initialize`)
    monitors.forEach((monitor) => {
        if (monitor.is_active && !monitor.in_maintenance) monitorService.startMonitor(monitor)
    })
}

/**
 *
 */
async function postInstall() {
    // TODO: SMTP is still broken. It looks like it cannot resolve localhost. Need to fix this.
    // const monitor = await MonitorService.getInstance().getMonitorById(24)
    // if (!monitor) return
    //
    // const ntfy = await NotificationService.getInstance().getNotificationsForMonitor(monitor)
    // if (ntfy.length !== 1) return
    //
    // await SmtpService.getInstance().sendMail(ntfy[0])
}

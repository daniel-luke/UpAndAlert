import { Logger } from '~~/server/utils/Logger'
import type { Knex } from 'knex'
import { DatabaseService } from '~~/server/modules/core/services/DatabaseService'
import { UserService } from '~~/server/modules/auth/services/UserService'

const logger = Logger.getInstance()

export default defineNitroPlugin(async () => {
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

    logger.info('core', 'Booting application')
})

async function prepareDatabase(): Promise<Knex | null> {
    const adapter = DatabaseService.getInstance().getAdapter()
    await adapter.connect()
    await adapter.migrate()
    return adapter.getKnex()
}

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

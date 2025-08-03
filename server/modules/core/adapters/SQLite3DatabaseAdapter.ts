import { DatabaseAdapter } from '~~/server/modules/core/adapters/DatabaseAdapter'
import knex from 'knex'
import type { Knex } from 'knex'
import { Logger } from '~~/server/utils/Logger'

const logger = Logger.getInstance()

/**
 * @name SQLite3DatabaseAdapter
 * @description This class is responsible for connecting to the SQLite3 database
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class SQLite3DatabaseAdapter extends DatabaseAdapter {
    private static _instance: SQLite3DatabaseAdapter | null = null
    private db: Knex | null = null

    protected constructor() {
        super()
    }

    /**
     * Get the singleton instance of the SQLite3DatabaseAdapter
     * @returns {SQLite3DatabaseAdapter} The singleton instance of the SQLite3DatabaseAdapter
     */
    public static getInstance(): SQLite3DatabaseAdapter {
        if (!this._instance) {
            this._instance = new SQLite3DatabaseAdapter()
        }
        return this._instance
    }

    /**
     * Connect to the SQLite3 database
     * @returns {Promise<void>} A promise that resolves when the connection is established
     */
    async connect(): Promise<void> {
        logger.info('DB', 'Connecting to SQLite3...')
        this.db = knex({
            client: 'sqlite3',
            connection: {
                filename: './.data/db.sqlite3'
            },
            migrations: {
                directory: './server/utils/migrations'
            },
            useNullAsDefault: true
        })
    }

    /**
     * Run database migrations
     * @returns {Promise<void>} A promise that resolves when the migrations are completed
     */
    async migrate(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not connected')
        }
        logger.info('DB', 'Starting database migrations...')
        await this.db.migrate.latest().then(() => {
            logger.info('DB', 'Database migrations completed...')
        })
    }

    /**
     * Close the database connection
     * @returns {Promise<void>} A promise that resolves when the connection is closed
     */
    async close(): Promise<void> {
        if (this.db) {
            await this.db.destroy()
            this.db = null
        }
    }

    /**
     * Get the Knex instance
     * @returns {Knex} The Knex instance
     */
    getKnex(): Knex {
        if (!this.db) {
            throw new Error('Database not connected')
        }
        return this.db
    }
}

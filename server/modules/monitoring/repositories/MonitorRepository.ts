import type { Knex } from 'knex'
import { DatabaseService } from '~~/server/modules/core/services/DatabaseService'
import { Monitor } from '~~/server/modules/monitoring/models/Monitor' // Your Knex adapter

/**
 * @name UserRepository
 * @description Repository for monitor operations
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class MonitorRepository {
    /**
     * @description Singleton instance of the MonitorRepository
     * @private
     */
    private static instance: MonitorRepository

    /**
     * @description Knex instance for database operations
     * @private
     */
    private db: Knex = DatabaseService.getInstance().getAdapter().getKnex()

    private constructor() {}

    /**
     * @description Get the singleton instance of the MonitorRepository
     * @returns {MonitorRepository}
     */
    static getInstance(): MonitorRepository {
        if (!MonitorRepository.instance) {
            MonitorRepository.instance = new MonitorRepository()
        }
        return MonitorRepository.instance
    }

    /**
     * @description Find a monitor by their ID
     * @param id
     * @returns {Promise<Monitor | undefined>}
     */
    async findById(id: number): Promise<Monitor | undefined> {
        return this.db<Monitor>('monitors').where({ id }).first()
    }

    /**
     * @description Create a new monitor
     * @returns {Promise<Monitor>}
     * @param monitor
     */
    async create(monitor: Omit<Monitor, 'id' | 'in_maintenance' | 'is_active'>): Promise<Monitor> {
        const [created] = await this.db<Monitor>('monitors').insert(monitor).returning('*')
        return created
    }

    /**
     * @description Updates a monitor
     * @param id
     * @param updates
     * @returns {Promise<Monitor | undefined>}
     */
    async update(id: number, updates: Partial<Omit<Monitor, 'id'>>): Promise<Monitor | undefined> {
        const [updated] = await this.db<Monitor>('monitors')
            .where({ id })
            .update(updates)
            .returning('*')
        return updated
    }

    /**
     * @description Delete a monitor
     * @param id
     * @returns {Promise<void>}
     */
    async delete(id: number): Promise<void> {
        await this.db<Monitor>('monitors').where({ id }).delete()
    }

    /**
     * @description Get all monitors
     * @returns {Promise<Monitor[]>}
     */
    async all(): Promise<Monitor[]> {
        return this.db<Monitor>('monitors').select('*')
    }
}

import type { Knex } from 'knex'
import { DatabaseService } from '~~/server/modules/core/services/DatabaseService'
import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import type { Status } from '~~/server/modules/monitoring/types/Status'
import type { Heartbeat } from '~~/server/modules/monitoring/models/Heartbeat'

/**
 * @name UserRepository
 * @description Repository for monitor operations
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class MonitorRepository {
    private static instance: MonitorRepository

    private db: Knex = DatabaseService.getInstance().getAdapter().getKnex()

    private constructor() {}

    static getInstance(): MonitorRepository {
        if (!MonitorRepository.instance) {
            MonitorRepository.instance = new MonitorRepository()
        }
        return MonitorRepository.instance
    }

    async findById(id: number): Promise<Monitor | undefined> {
        return this.db<Monitor>('monitors').where({ id }).first()
    }

    async create(monitor: Omit<Monitor, 'id' | 'in_maintenance' | 'is_active'>): Promise<Monitor> {
        const [created] = await this.db<Monitor>('monitors').insert(monitor).returning('*')
        return created
    }

    async update(id: number, updates: Partial<Omit<Monitor, 'id'>>): Promise<Monitor | undefined> {
        const [updated] = await this.db<Monitor>('monitors')
            .where({ id })
            .update(updates)
            .returning('*')
        return updated
    }

    async delete(id: number): Promise<void> {
        await this.db<Monitor>('monitors').where({ id }).delete()
    }

    async all(): Promise<Monitor[]> {
        return this.db<Monitor>('monitors').select('*')
    }

    async registerHeartbeat(
        monitor: Monitor,
        statusCode: number,
        status: Status
    ): Promise<Heartbeat> {
        const [created] = await this.db<Heartbeat>('heartbeats')
            .insert({
                monitor_id: monitor.id,
                status_code: statusCode,
                status: status
            })
            .returning('*')
        return created
    }
}

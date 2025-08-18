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

    async create(
        monitor: Omit<
            Monitor,
            'id' | 'in_maintenance' | 'is_active' | 'job' | 'startJob' | 'stopJob' | 'notified'
        >
    ): Promise<Monitor> {
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
        await this.db<Heartbeat>('heartbeats').where({ monitor_id: id }).delete()
    }

    async all(): Promise<Monitor[]> {
        return this.db<Monitor>('monitors').select('*')
    }

    async allActive(): Promise<Monitor[]> {
        return this.db<Monitor>('monitors').select('*').where({ is_active: true })
    }

    async paginate(page: number, pageSize: number): Promise<Monitor[]> {
        return this.db<Monitor>('monitors')
            .select('*')
            .orderBy('id', 'desc')
            .limit(pageSize)
            .offset((page - 1) * pageSize)
    }

    async pause(id: number): Promise<void> {
        return this.db<Monitor>('monitors').where({ id }).update({ is_active: false })
    }

    async resume(id: number): Promise<void> {
        return this.db<Monitor>('monitors').where({ id }).update({ is_active: true })
    }

    async setNotified(monitor: Monitor, notified: boolean): Promise<void> {
        await this.db<Monitor>('monitors')
            .where({ id: monitor.id })
            .update({ notified: notified ? 1 : 0 })
    }

    async registerHeartbeat(
        monitor: Monitor,
        statusCode: number,
        status: Status,
        responseTime: number
    ): Promise<Heartbeat> {
        const [created] = await this.db<Heartbeat>('heartbeats')
            .insert({
                monitor_id: monitor.id,
                status_code: statusCode,
                status: status,
                response_time: responseTime,
                created_at: new Date()
            })
            .returning('*')
        return created
    }

    async getHeartbeatHistory(monitor: Monitor, limit?: number): Promise<Heartbeat[]> {
        if (limit !== undefined) {
            return this.db<Heartbeat>('heartbeats')
                .where({ monitor_id: monitor.id })
                .select('*')
                .orderBy('created_at', 'desc')
                .limit(limit)
        }
        return this.db<Heartbeat>('heartbeats')
            .where({ monitor_id: monitor.id })
            .select('*')
            .orderBy('created_at', 'desc')
    }

    async getLastHeartbeat(monitor: Monitor): Promise<Heartbeat | undefined> {
        return this.db<Heartbeat>('heartbeats')
            .where({ monitor_id: monitor.id })
            .select('*')
            .orderBy('created_at', 'desc')
            .first()
    }
}

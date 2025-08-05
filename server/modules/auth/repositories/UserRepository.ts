import type { Knex } from 'knex'
import { DatabaseService } from '~~/server/modules/core/services/DatabaseService'
import type { User } from '#auth-utils' // Your Knex adapter

/**
 * @name UserRepository
 * @description Repository for user operations
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class UserRepository {
    private static instance: UserRepository

    private db: Knex = DatabaseService.getInstance().getAdapter().getKnex()

    private constructor() {}

    static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository()
        }
        return UserRepository.instance
    }

    async findById(id: number): Promise<User | undefined> {
        return this.db<User>('users').where({ id }).first()
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.db<User>('users').where({ email }).first()
    }

    async create(user: Omit<User, 'id'>): Promise<User> {
        const [created] = await this.db<User>('users').insert(user).returning('*')
        return created
    }

    async update(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User | undefined> {
        const [updated] = await this.db<User>('users').where({ id }).update(updates).returning('*')
        return updated
    }

    async delete(id: number): Promise<void> {
        await this.db<User>('users').where({ id }).delete()
    }

    async all(): Promise<User[]> {
        return this.db<User>('users').select('*')
    }
}

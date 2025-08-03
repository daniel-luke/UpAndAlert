import type { Knex } from 'knex'
import type { User } from '~~/server/modules/auth/models/User'
import { DatabaseService } from '~~/server/modules/core/services/DatabaseService' // Your Knex adapter

/**
 * @name UserRepository
 * @description Repository for user operations
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class UserRepository {
    /**
     * @description Singleton instance of the UserRepository
     * @private
     */
    private static instance: UserRepository

    /**
     * @description Knex instance for database operations
     * @private
     */
    private db: Knex = DatabaseService.getInstance().getAdapter().getKnex()

    private constructor() {}

    /**
     * @description Get the singleton instance of the UserRepository
     * @returns {UserRepository}
     */
    static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository()
        }
        return UserRepository.instance
    }

    /**
     * @description Find a user by their ID
     * @param id
     * @returns {Promise<User | undefined>}
     */
    async findById(id: number): Promise<User | undefined> {
        return this.db<User>('users').where({ id }).first()
    }

    /**
     * @description Find a user by their email
     * @param email
     * @returns {Promise<User | undefined>}
     */
    async findByEmail(email: string): Promise<User | undefined> {
        return this.db<User>('users').where({ email }).first()
    }

    /**
     * @description Create a new user
     * @param user
     * @returns {Promise<User>}
     */
    async create(user: Omit<User, 'id'>): Promise<User> {
        const [created] = await this.db<User>('users').insert(user).returning('*')
        return created
    }

    /**
     * @description Update a user
     * @param id
     * @param updates
     * @returns {Promise<User | undefined>}
     */
    async update(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User | undefined> {
        const [updated] = await this.db<User>('users').where({ id }).update(updates).returning('*')
        return updated
    }

    /**
     * @description Delete a user
     * @param id
     * @returns {Promise<void>}
     */
    async delete(id: number): Promise<void> {
        await this.db<User>('users').where({ id }).delete()
    }

    /**
     * @description Get all users
     * @returns {Promise<User[]>}
     */
    async all(): Promise<User[]> {
        return this.db<User>('users').select('*')
    }
}

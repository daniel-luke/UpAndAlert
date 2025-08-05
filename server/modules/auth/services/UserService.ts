import { UserRepository } from '~~/server/modules/auth/repositories/UserRepository'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import type { User } from '#auth-utils'

/**
 * @name UserService
 * @description Service class for handling user-related operations.
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class UserService {
    private static instance: UserService

    private constructor(private userRepository: UserRepository) {}

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(UserRepository.getInstance())
        }
        return UserService.instance
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.userRepository.findById(id)
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findByEmail(email)
    }

    async createUser(data: {
        email: string
        password: string
        first_name: string
        last_name: string
        is_admin?: boolean
    }): Promise<User> {
        const password_hash = await bcrypt.hash(data.password, 10)
        return this.userRepository.create({
            email: data.email,
            password_hash,
            first_name: data.first_name,
            last_name: data.last_name,
            is_admin: !!data.is_admin
        })
    }

    async updateUser(
        id: number,
        updates: Partial<Omit<User, 'id' | 'password_hash'>> & { password?: string }
    ): Promise<User | undefined> {
        const { password, ...rest } = updates
        const updateData: Partial<Omit<User, 'id'>> = { ...rest }
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10)
        }
        return this.userRepository.update(id, updateData)
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id)
    }

    async listUsers(): Promise<User[]> {
        return this.userRepository.all()
    }

    async passwordMatches(plainPassword: string, user: User): Promise<boolean> {
        return bcrypt.compare(plainPassword, user.password_hash)
    }

    async getUserSession(event: H3Event) {
        const { user } = await requireUserSession(event)
        return user
    }

    async checkAuthenticated(event: H3Event): Promise<void> {
        const { user } = await requireUserSession(event)
        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }
    }
}

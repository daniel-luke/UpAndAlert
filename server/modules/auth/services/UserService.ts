// server/services/UserService.ts
import { UserRepository } from "~~/server/modules/auth/repositories/UserRepository";
import { User } from "~~/server/modules/auth/interfaces/User";
import bcrypt from "bcryptjs";

/**
 * @name UserService
 * @description Service class for handling user-related operations.
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class UserService {
    private static instance: UserService;

    /**
     * @name constructor
     * @description Private constructor to enforce singleton pattern.
     * @private
     * @param userRepository - The repository for user data.
     */
    private constructor(private userRepository: UserRepository) {}

    /**
     * @name getInstance
     * @description Gets the singleton instance of the UserService.
     * @returns {UserService} The singleton instance of the UserService.
     */
    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(UserRepository.getInstance());
        }
        return UserService.instance;
    }

    /**
     * @name getUserById
     * @description Retrieves a user by their ID.
     * @param id - The ID of the user to retrieve.
     * @returns {Promise<User | undefined>} A promise that resolves to the user if found, or undefined if not found.
     */
    async getUserById(id: number): Promise<User | undefined> {
        return this.userRepository.findById(id);
    }

    /**
     * @name getUserByEmail
     * @description Retrieves a user by their email.
     * @param email - The email of the user to retrieve.
     * @returns {Promise<User | undefined>} A promise that resolves to the user if found, or undefined if not found.
     */
    async getUserByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findByEmail(email);
    }

    /**
     * @name createUser
     * @description Creates a new user.
     * @param data - The user data to create.
     * @returns {Promise<User>} A promise that resolves to the created user.
     */
    async createUser(data: {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        is_admin?: boolean;
    }): Promise<User> {
        const password_hash = await bcrypt.hash(data.password, 10);
        return this.userRepository.create({
            email: data.email,
            password_hash,
            first_name: data.first_name,
            last_name: data.last_name,
            is_admin: !!data.is_admin,
        });
    }

    /**
     * @name updateUser
     * @description Updates a user's information.
     * @param id - The ID of the user to update.
     * @param updates - The updates to apply to the user.
     * @returns {Promise<User | undefined>} A promise that resolves to the updated user if found, or undefined if not found.
     */
    async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'password_hash'>> & { password?: string }): Promise<User | undefined> {
        const { password, ...rest } = updates;
        let updateData: Partial<Omit<User, 'id'>> = { ...rest };
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }
        return this.userRepository.update(id, updateData);
    }

    /**
     * @name deleteUser
     * @description Deletes a user by their ID.
     * @param id - The ID of the user to delete.
     * @returns {Promise<void>} A promise that resolves when the user is deleted.
     */
    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    /**
     * @name listUsers
     * @description Lists all users.
     * @returns {Promise<User[]>} A promise that resolves to an array of all users.
     */
    async listUsers(): Promise<User[]> {
        return this.userRepository.all();
    }

    /**
     * @name passwordMatches
     * @description Checks if a plain password matches the hashed password of a user.
     * @param plainPassword - The plain password to check.
     * @param user - The user object containing the hashed password.
     * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
     */
    async passwordMatches(plainPassword: string, user: User): Promise<boolean> {
        return bcrypt.compare(plainPassword, user.password_hash);
    }
}

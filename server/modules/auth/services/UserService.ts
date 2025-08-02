// server/services/UserService.ts
import { UserRepository } from "~~/server/modules/auth/repositories/UserRepository";
import { User } from "~~/server/modules/auth/interfaces/User";
import bcrypt from "bcryptjs";

export class UserService {
    private static instance: UserService;

    private constructor(private userRepository: UserRepository) {}

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(UserRepository.getInstance());
        }
        return UserService.instance;
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.userRepository.findById(id);
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findByEmail(email);
    }

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

    async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'password_hash'>> & { password?: string }): Promise<User | undefined> {
        const { password, ...rest } = updates;
        let updateData: Partial<Omit<User, 'id'>> = { ...rest };
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }
        return this.userRepository.update(id, updateData);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async listUsers(): Promise<User[]> {
        return this.userRepository.all();
    }

    async passwordMatches(plainPassword: string, user: User): Promise<boolean> {
        return bcrypt.compare(plainPassword, user.password_hash);
    }
}

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {IUser} from "~~/server/modules/auth/models/User";
import {UserRepository} from "~~/server/modules/auth/repositories/User";

export class UserService {
    private static _instance: UserService;
    private _userRepository: UserRepository;
    private _jwtSecret: string = process.env.JWT_SECRET || "secret";

    private constructor() {
        this._userRepository = UserRepository.getInstance();
    }

    private async getUserByUsername(username: string): Promise<IUser | null> {
        return await this._userRepository.findByUsername(username);
    }

    public static getInstance(): UserService {
        if (!UserService._instance) {
            UserService._instance = new UserService();
        }
        return UserService._instance;
    }

    public async createUser(username: string, name: string, email: string, password: string, isAdmin: boolean = false): Promise<Number> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user: IUser = {
            username,
            name,
            email,
            password: hashedPassword,
            isAdmin
        }
        return await this._userRepository.create(user);
    }

    public async login(username: string, password: string): Promise<{} | null> {
        const user = await this.getUserByUsername(username);
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return  jwt.sign({id: user.id, username: user.username, isAdmin: user.isAdmin}, this._jwtSecret, {expiresIn: '1h'});
    }


}

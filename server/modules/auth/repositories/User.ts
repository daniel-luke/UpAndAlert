import {Knex} from "knex";
import {DatabaseService} from "~~/server/modules/core/services/DatabaseService";
import {IUser} from "~~/server/modules/auth/models/User";

export class UserRepository {
    private static _instance: UserRepository;
    private adapter: Knex;

    private TABLE_NAME = 'users';

    private constructor() {
        this.adapter = DatabaseService.getInstance().getAdapter().getKnex();
    }

    public static getInstance(): UserRepository {
        if (!UserRepository._instance) {
            UserRepository._instance = new UserRepository();
        }
        return UserRepository._instance;
    }

    public async create(user: IUser) {
        if (await this.userExists(user)) {
            throw new Error('User already exists');
        }
        const [createdUser] = await this.adapter<IUser>(this.TABLE_NAME).insert(user);
        return createdUser;
    }

    public async userExists(user: IUser) {
        const [userFoundByUsername] = await this.adapter<IUser>(this.TABLE_NAME).where({username: user.username});
        const [userFoundByEmail] = await this.adapter<IUser>(this.TABLE_NAME).where({email: user.email});
        return !!userFoundByUsername || !!userFoundByEmail;
    }

    public async findByUsername(username: string) {
        const [user] = await this.adapter<IUser>(this.TABLE_NAME).where({username});
        return user;
    }

    public async findByEmail(email: string) {
        const [user] = await this.adapter<IUser>(this.TABLE_NAME).where({email});
        return user;
    }
}

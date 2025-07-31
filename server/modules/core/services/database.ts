import knex from "knex";
import {Logger} from "~~/server/utils/Logger";

export default class Database {
    static instance: Database;

    private db: any;

    private logger = Logger.getInstance();

    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private constructor() {
    }

    public getDB() {
        return this.db;
    }

    public async init() {

        // Init DB
        const DB_TYPE: string = process.env.DB_TYPE || "sqlite";
        this.logger.info("DB", `Using ${DB_TYPE} as database`);

        this.db = knex({
            client: DB_TYPE,
            connection: {
                filename: "./.data/db.sqlite3"
            },
            migrations: {
                directory: "./server/utils/migrations",
            },
            useNullAsDefault: true
        });

        // Run latest migrations
        await this.db.migrate.latest().then(() => {
            this.logger.info("DB", "Database migrations completed")
        });
    }
}
